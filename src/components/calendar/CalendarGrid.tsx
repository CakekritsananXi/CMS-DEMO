import React, { useState } from 'react';
import { useDrop } from 'react-dnd';
import { format, addDays, startOfWeek, endOfWeek, eachDayOfInterval } from 'date-fns';

interface CalendarGridProps {
  view: 'month' | 'week' | 'day';
  currentDate: Date;
  onDateClick?: (date: Date) => void;
}

const CalendarGrid: React.FC<CalendarGridProps> = ({ view, currentDate, onDateClick }) => {
  const [draggedContent, setDraggedContent] = useState<any>(null);

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());
    
    const days = [];
    for (let i = 0; i < 42; i++) {
      const day = new Date(startDate);
      day.setDate(startDate.getDate() + i);
      days.push(day);
    }
    return days;
  };

  const getWeekDays = (date: Date) => {
    const start = startOfWeek(date);
    const end = endOfWeek(date);
    return eachDayOfInterval({ start, end });
  };

  const days = getDaysInMonth(currentDate);
  const weekDays = getWeekDays(currentDate);
  const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  if (view === 'month') {
    return (
      <div className="p-3 sm:p-6">
        {/* Weekday Headers */}
        <div className="grid grid-cols-7 mb-4">
          {weekdays.map((day) => (
            <div key={day} className="p-2 sm:p-3 text-center text-xs sm:text-sm font-medium text-neutral-500">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Days */}
        <div className="grid grid-cols-7 gap-1 sm:gap-2">
          {days.map((day, index) => {
            const isCurrentMonth = day.getMonth() === currentDate.getMonth();
            const isToday = day.toDateString() === new Date().toDateString();

            return (
              <CalendarDay
                key={index}
                date={day}
                isCurrentMonth={isCurrentMonth}
                isToday={isToday}
                onDateClick={onDateClick}
                onContentDrop={(content) => {
                  console.log('Content dropped on', format(day, 'yyyy-MM-dd'), content);
                }}
              />
            );
          })}
        </div>
      </div>
    );
  }

  if (view === 'week') {
    return (
      <div className="p-3 sm:p-6 overflow-x-auto">
        <div className="grid grid-cols-8 gap-1">
          <div className="p-3"></div>
          {weekDays.map((day) => (
            <div key={day.toISOString()} className="p-3 text-center">
              <div className="text-sm font-medium text-neutral-900">
                {format(day, 'EEE')}
              </div>
              <div className={`text-lg font-semibold mt-1 ${
                day.toDateString() === new Date().toDateString() 
                  ? 'text-sage' 
                  : 'text-neutral-700'
              }`}>
                {format(day, 'd')}
              </div>
            </div>
          ))}
          
          {Array.from({ length: 24 }, (_, hour) => (
            <React.Fragment key={hour}>
              <div className="p-2 text-xs text-neutral-500 text-right border-r border-neutral-100">
                {format(new Date().setHours(hour, 0, 0, 0), 'ha')}
              </div>
              {weekDays.map((day) => (
                <div
                  key={`${day.toISOString()}-${hour}`}
                  className="min-h-[60px] border border-neutral-100 hover:bg-neutral-50 transition-colors duration-200"
                />
              ))}
            </React.Fragment>
          ))}
        </div>
      </div>
    );
  }

  if (view === 'day') {
    return (
      <div className="p-3 sm:p-6">
        <div className="text-center mb-6">
          <h3 className="text-xl sm:text-2xl font-bold text-neutral-900">
            {format(currentDate, 'EEEE, MMMM d, yyyy')}
          </h3>
        </div>
        
        <div className="grid grid-cols-2 gap-1">
          <div className="space-y-1">
            {Array.from({ length: 24 }, (_, hour) => (
              <div key={hour} className="flex items-center">
                <div className="w-12 sm:w-16 text-xs text-neutral-500 text-right pr-2 sm:pr-4">
                  {format(new Date().setHours(hour, 0, 0, 0), 'ha')}
                </div>
                <div className="flex-1 min-h-[40px] sm:min-h-[60px] border border-neutral-100 hover:bg-neutral-50 transition-colors duration-200 rounded-lg" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-3 sm:p-6">
      <div className="text-center text-neutral-500">
        View not implemented
      </div>
    </div>
  );
};

interface CalendarDayProps {
  date: Date;
  isCurrentMonth: boolean;
  isToday: boolean;
  onDateClick?: (date: Date) => void;
  onContentDrop?: (content: any) => void;
}

const CalendarDay: React.FC<CalendarDayProps> = ({ date, isCurrentMonth, isToday, onDateClick, onContentDrop }) => {
  const [{ isOver }, drop] = useDrop({
    accept: 'content',
    drop: (item) => {
      if (onContentDrop) {
        onContentDrop(item);
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });

  const sampleContent = date.getDate() % 7 === 0 && isCurrentMonth ? {
    title: 'Blog Post',
    type: 'blog',
    time: '2:00 PM',
  } : null;

  return (
    <div
      ref={drop}
      onClick={() => onDateClick && onDateClick(date)}
      className={`min-h-[80px] sm:min-h-[120px] p-2 sm:p-3 border border-neutral-100 transition-all duration-200 ${
        isCurrentMonth ? 'bg-white' : 'bg-neutral-50'
      } ${
        isOver ? 'bg-sage/5 border-sage/30' : ''
      } hover:bg-neutral-50 cursor-pointer ${
        onDateClick ? 'hover:border-sage/30' : ''
      }`}
    >
      <div className={`text-sm font-medium mb-2 ${
        isToday 
          ? 'w-5 h-5 sm:w-6 sm:h-6 bg-sage text-white rounded-full flex items-center justify-center text-xs'
          : isCurrentMonth 
            ? 'text-neutral-900' 
            : 'text-neutral-400'
      }`}>
        {date.getDate()}
      </div>

      {sampleContent && (
        <div className="bg-sage/10 text-sage p-1 sm:p-2 rounded-lg text-xs mb-2 border border-sage/20 cursor-pointer hover:bg-sage/20 transition-colors duration-200">
          <div className="font-medium">{sampleContent.title}</div>
          <div className="text-sage/70 hidden sm:block">{sampleContent.time}</div>
        </div>
      )}
    </div>
  );
};

export default CalendarGrid;