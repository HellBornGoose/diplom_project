import React, { useState, useEffect, useRef } from 'react';
import styles from '../css/Calendar.module.css';
import arrowLeft from '../../img/arrowLeft.svg';
import arrowRight from '../../img/arrorRight.svg';

const Day = ({ date, bookings }) => {
    const day = date.getDate();
    const month = date.getMonth();
    const year = date.getFullYear();
  
    const dayBookings = bookings.filter((booking) => {
      const from = new Date(booking.dateFrom);
      const to = new Date(booking.dateTo);
  
      return (
        (from.getDate() === day && from.getMonth() === month && from.getFullYear() === year) ||
        (to.getDate() === day && to.getMonth() === month && to.getFullYear() === year)
      );
    });
  
    const bookingsPerRow = 1;
    const rows = [];
  
    for (let i = 0; i < dayBookings.length; i += bookingsPerRow) {
      rows.push(dayBookings.slice(i, i + bookingsPerRow));
    }
  
    return (
      <div>
        <div className={styles.dayNumber}>
          {day}{' '}
          <span className={styles.weekDay}>
            {date.toLocaleDateString('uk-UA', {
              weekday: 'long',
            }).replace(/^./, (c) => c.toUpperCase())}
          </span>
        </div>
        <div className={styles.dayIcon}>
          {rows.map((row, rowIndex) => (
            <div key={rowIndex} className={styles.bookingRow}>
              {row.map((booking) => {
                const from = new Date(booking.dateFrom);
                const to = new Date(booking.dateTo);
  
                const isArrival =
                  from.getDate() === day &&
                  from.getMonth() === month &&
                  from.getFullYear() === year;
  
                const isDeparture =
                  to.getDate() === day &&
                  to.getMonth() === month &&
                  to.getFullYear() === year;
  
                const bgColor = isArrival ? '#AFB06A' : isDeparture ? '#FFE8D9' : 'transparent';
                const time = isArrival ? booking.checkInTime : isDeparture ? booking.checkOutTime : '';
  
                return (
                  <div
                    key={`${booking.listingId}-${rowIndex}`}
                    className={styles.booking}
                    style={{ backgroundColor: bgColor }}
                  >
                    <p style={{ color: isArrival ? '#FFE8D9' : isDeparture ? '#E07B3B' : '#221F50', }}> Бронювання №{booking.listingId} </p>
                    <p style={{ color: '#221F50' }}>
                      {isArrival ? "В'їзд о" : isDeparture ? 'Виїзд о' : ''} {time?.slice(0, 5)}
                    </p>
                    <p style={{ color: '#221F50' }}>{booking.listingName}</p>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    );
  };
  

const Calendar = () => {
const now = new Date();
  const [bookings, setBookings] = useState([]);
  const [currentOffset, setCurrentOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(null);
  const [startOffset, setStartOffset] = useState(0);
  const containerRef = useRef(null);
  const [calendarWidth, setCalendarWidth] = useState(0);
  const [containerWidth, setContainerWidth] = useState(0);
  const [currentYear, setCurrentYear] = useState(now.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(now.getMonth());

  const ngrokLink = "http://localhost:5197";

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const token = localStorage.getItem('jwtToken');
  
        const response = await fetch(`${ngrokLink}/api/listing/get-landlord-bookingsDate`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
  
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
  
        const data = await response.json();
        const formattedBookings = data.map((item) => ({
          ...item,
          dateFrom: new Date(item.dateFrom),
          dateTo: new Date(item.dateTo),
        }));
        setBookings(formattedBookings);
      } catch (error) {
        console.error('Помилка завантаження бронювань:', error);
      }
    };
  
    fetchBookings();
  
    const updateWidths = () => {
      if (containerRef.current) {
        setCalendarWidth(containerRef.current.scrollWidth);
        setContainerWidth(containerRef.current.parentElement.offsetWidth);
      }
    };
  
    updateWidths();
    window.addEventListener('resize', updateWidths);
    return () => window.removeEventListener('resize', updateWidths);
  }, []);
  

  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const days = Array.from({ length: daysInMonth }, (_, i) => new Date(currentYear, currentMonth, i + 1));

  const velocityRef = useRef(0);
  const animationFrameRef = useRef(null);

  const handleDrag = (e) => {
    if (isDragging && startX !== null) {
      const deltaX = e.clientX - startX;

      const minOffset = Math.min(0, containerWidth - calendarWidth);
      const maxOffset = 0;

      let newOffset = startOffset + deltaX;
      if (newOffset > maxOffset) newOffset = maxOffset;
      if (newOffset < minOffset) newOffset = minOffset;

      velocityRef.current = e.movementX;
      setCurrentOffset(newOffset);
    }
  };

  const handleDragStart = (e) => {
    setIsDragging(true);
    setStartX(e.clientX);
    setStartOffset(currentOffset);
    velocityRef.current = 0;
  };

  const handleDragEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);
    setStartX(null);

    let velocity = velocityRef.current;

    const minOffset = Math.min(0, containerWidth - calendarWidth);
    const maxOffset = 0;

    const friction = 0.95;
    const threshold = 0.5;

    const animate = () => {
      if (Math.abs(velocity) > threshold) {
        setCurrentOffset((prev) => {
          let next = prev + velocity;
          if (next > maxOffset) next = maxOffset;
          if (next < minOffset) next = minOffset;
          return next;
        });

        velocity *= friction;
        animationFrameRef.current = requestAnimationFrame(animate);
      } else {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };

    requestAnimationFrame(animate);
  };

  const handlePrevMonth = () => {
    setCurrentOffset(0);
    setCurrentMonth((prev) => {
      if (prev === 0) {
        setCurrentYear(currentYear - 1);
        return 11;
      }
      return prev - 1;
    });
  };

  const handleNextMonth = () => {
    setCurrentOffset(0);
    setCurrentMonth((prev) => {
      if (prev === 11) {
        setCurrentYear(currentYear + 1);
        return 0;
      }
      return prev + 1;
    });
  };

  const getMonthName = (monthIndex) =>
    new Date(currentYear, monthIndex)
      .toLocaleString('uk-UA', { month: 'long' })
      .replace(/^./, (c) => c.toUpperCase());

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        

        <h1 className={styles.title}>
        <button className={styles.arrowButtonLeft} onClick={handlePrevMonth}>
          <img src={arrowLeft} alt="Назад" />
        </button>
          {getMonthName(currentMonth)} {currentYear}
          <button className={styles.arrowButtonRight} onClick={handleNextMonth}>
          <img src={arrowRight} alt="Вперед" />
        </button>
        </h1>

        
      </div>

      <div
        ref={containerRef}
        className={`${styles.calendar} ${isDragging ? styles.dragging : ''}`}
        onMouseDown={handleDragStart}
        onMouseMove={handleDrag}
        onMouseUp={handleDragEnd}
        onMouseLeave={handleDragEnd}
        style={{ transform: `translateX(${currentOffset}px)` }}
      >
        {days.map((date) => (
          <Day key={date.toISOString()} date={date} bookings={bookings} />
        ))}
      </div>
    </div>
  );
};

export default Calendar;
