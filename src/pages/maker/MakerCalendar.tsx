import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import { jobs } from '../../features/makerJobs/mockJobs';
import {
  getCalendarEvents,
  getBlackoutDates,
  addBlackoutDate,
  removeBlackoutDate,
  computeCounts,
  getJobsForDate,
  type BlackoutDate,
  type CalendarFilters
} from '../../features/makerCalendar/mockMakerCalendar';

// Define interfaces for calendar event handlers
interface DateClickInfo {
  dateStr: string;
}

interface EventClickInfo {
  event: {
    start: Date | null;
  };
}

const MakerCalendar: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [showDayDetails, setShowDayDetails] = useState(false);
  const [showBlackoutModal, setShowBlackoutModal] = useState<boolean>(false);

  // Filter states
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [priorityFilter, setPriorityFilter] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Availability states
  const [acceptingNewJobs, setAcceptingNewJobs] = useState<boolean>(true);
  const [blackoutDates, setBlackoutDates] = useState<BlackoutDate[]>(getBlackoutDates());
  const [blackoutForm, setBlackoutForm] = useState({
    startDate: '',
    endDate: '',
    reason: ''
  });

  // Get filtered data using the feature module
  const filters: CalendarFilters = { statusFilter, priorityFilter, searchQuery };
  const calendarEvents = getCalendarEvents(jobs, filters);
  const { dueToday, dueThisWeek, overdue, blocked } = computeCounts(jobs);

  // Handle date click
  const handleDateClick = (info: DateClickInfo) => {
    const clickedDate = info.dateStr;
    setSelectedDate(clickedDate);
    setShowDayDetails(true);
  };

  // Handle event click to show day details for that date
  const handleEventClick = (info: EventClickInfo) => {
    const eventDate = info.event.start?.toString();
    if (eventDate) {
      setSelectedDate(eventDate);
      setShowDayDetails(true);
    }
  };

  // Close day details panel/modal
  const closeDayDetails = () => {
    setShowDayDetails(false);
    setSelectedDate(null);
  };

  // Blackout date handlers
  const openBlackoutModal = () => {
    setBlackoutForm({ startDate: '', endDate: '', reason: '' });
    setShowBlackoutModal(true);
  };

  const closeBlackoutModal = () => {
    setShowBlackoutModal(false);
    setBlackoutForm({ startDate: '', endDate: '', reason: '' });
  };

  const handleBlackoutSubmit = () => {
    if (!blackoutForm.startDate || !blackoutForm.endDate) return;

    const newBlackout = addBlackoutDate({
      startDate: blackoutForm.startDate,
      endDate: blackoutForm.endDate,
      reason: blackoutForm.reason.trim() || undefined
    });

    setBlackoutDates(prev => [...prev, newBlackout]);
    closeBlackoutModal();
  };

  const handleRemoveBlackoutDate = (id: string) => {
    removeBlackoutDate(id);
    setBlackoutDates(getBlackoutDates());
  };

  const selectedDateJobs = selectedDate ? getJobsForDate(jobs, selectedDate) : [];
  const formattedSelectedDate = selectedDate ? new Date(selectedDate).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }) : '';

  return (
    <>
      {/* Page Header */}
      <div className="mb-[25px]">
        <div className="flex flex-wrap items-center justify-between gap-[15px]">
          <div>
            <h1 className="text-[28px] lg:text-[32px] font-semibold text-dark dark:text-title-dark mb-[5px]">
              Calendar
            </h1>
            <p className="text-body dark:text-subtitle-dark">
              Track job deadlines and plan your production week
            </p>
          </div>

          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb">
            <ol className="flex items-center space-x-1 md:space-x-3">
              <li className="inline-flex items-center">
                <Link
                  to="/maker/dashboard"
                  className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-primary-600 dark:text-gray-400 dark:hover:text-white"
                >
                  <i className="material-symbols-outlined text-[18px] mr-[5px]">home</i>
                  Dashboard
                </Link>
              </li>
              <li>
                <div className="flex items-center">
                  <i className="material-symbols-outlined text-gray-400 text-[18px]">chevron_right</i>
                  <span className="ml-1 text-sm font-medium text-gray-500 md:ml-2 dark:text-gray-400">
                    Calendar
                  </span>
                </div>
              </li>
            </ol>
          </nav>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[25px] mb-[25px]">
        {/* Due Today */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-[25px] shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-body dark:text-subtitle-dark text-sm mb-[5px]">Due Today</p>
              <h3 className="text-[28px] font-semibold text-dark dark:text-title-dark">
                {dueToday.length}
              </h3>
              <div className="flex items-center gap-[5px] mt-[8px]">
                <span className="text-xs text-orange-600 dark:text-orange-400">
                  {dueToday.filter(job => job.priority === 'Rush').length} Rush
                </span>
                {dueToday.length > 0 && (
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    • {dueToday.filter(job => job.priority === 'Standard').length} Standard
                  </span>
                )}
              </div>
            </div>
            <div className="w-[60px] h-[60px] rounded-full bg-orange-50 dark:bg-orange-900/20 flex items-center justify-center">
              <i className="material-symbols-outlined text-[24px] text-orange-600 dark:text-orange-400">today</i>
            </div>
          </div>
        </div>

        {/* Due This Week */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-[25px] shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-body dark:text-subtitle-dark text-sm mb-[5px]">Due This Week</p>
              <h3 className="text-[28px] font-semibold text-dark dark:text-title-dark">
                {dueThisWeek.length}
              </h3>
              <div className="flex items-center gap-[5px] mt-[8px]">
                <span className="text-xs text-blue-600 dark:text-blue-400">
                  ${dueThisWeek.reduce((sum, job) => sum + job.payout, 0).toFixed(0)} total payout
                </span>
              </div>
            </div>
            <div className="w-[60px] h-[60px] rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center">
              <i className="material-symbols-outlined text-[24px] text-blue-600 dark:text-blue-400">date_range</i>
            </div>
          </div>
        </div>

        {/* Overdue */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-[25px] shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-body dark:text-subtitle-dark text-sm mb-[5px]">Overdue</p>
              <h3 className="text-[28px] font-semibold text-dark dark:text-title-dark">
                {overdue.length}
              </h3>
              <div className="flex items-center gap-[5px] mt-[8px]">
                <span className="text-xs text-red-600 dark:text-red-400">
                  Needs immediate attention
                </span>
              </div>
            </div>
            <div className="w-[60px] h-[60px] rounded-full bg-red-50 dark:bg-red-900/20 flex items-center justify-center">
              <i className="material-symbols-outlined text-[24px] text-red-600 dark:text-red-400">schedule</i>
            </div>
          </div>
        </div>

        {/* Blocked */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-[25px] shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-body dark:text-subtitle-dark text-sm mb-[5px]">Blocked</p>
              <h3 className="text-[28px] font-semibold text-dark dark:text-title-dark">
                {blocked.length}
              </h3>
              <div className="flex items-center gap-[5px] mt-[8px]">
                <span className="text-xs text-gray-600 dark:text-gray-400">
                  Waiting for resolution
                </span>
              </div>
            </div>
            <div className="w-[60px] h-[60px] rounded-full bg-gray-50 dark:bg-gray-900/20 flex items-center justify-center">
              <i className="material-symbols-outlined text-[24px] text-gray-600 dark:text-gray-400">block</i>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-[20px] mb-[25px] shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-[15px]">
          <div className="flex flex-wrap items-center gap-[15px]">
            {/* Status Filter */}
            <div className="flex items-center gap-[8px]">
              <label className="text-sm font-medium text-dark dark:text-title-dark">Status:</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-[12px] py-[8px] text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-dark dark:text-title-dark focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="All">All</option>
                <option value="Active">Active</option>
                <option value="Blocked">Blocked</option>
                <option value="Shipped">Shipped</option>
                <option value="Completed">Completed</option>
              </select>
            </div>

            {/* Priority Filter */}
            <div className="flex items-center gap-[8px]">
              <label className="text-sm font-medium text-dark dark:text-title-dark">Priority:</label>
              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                className="px-[12px] py-[8px] text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-dark dark:text-title-dark focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="All">All</option>
                <option value="Rush">Rush</option>
                <option value="Standard">Standard</option>
              </select>
            </div>
          </div>

          {/* Search */}
          <div className="flex items-center gap-[8px] min-w-[250px]">
            <label className="text-sm font-medium text-dark dark:text-title-dark">Search:</label>
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Job ID or product name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-[12px] py-[8px] pl-[35px] text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-dark dark:text-title-dark placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
              <i className="material-symbols-outlined absolute left-[10px] top-1/2 -translate-y-1/2 text-gray-400 text-[18px]">search</i>
            </div>
          </div>
        </div>

        {/* Active Filters Display */}
        {(statusFilter !== 'All' || priorityFilter !== 'All' || searchQuery.trim()) && (
          <div className="flex flex-wrap items-center gap-[8px] mt-[15px] pt-[15px] border-t border-gray-200 dark:border-gray-700">
            <span className="text-sm font-medium text-dark dark:text-title-dark">Active Filters:</span>

            {statusFilter !== 'All' && (
              <span className="inline-flex items-center gap-[4px] px-[8px] py-[4px] bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300 text-xs rounded-md">
                Status: {statusFilter}
                <button
                  onClick={() => setStatusFilter('All')}
                  className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200"
                >
                  <i className="material-symbols-outlined text-[14px]">close</i>
                </button>
              </span>
            )}

            {priorityFilter !== 'All' && (
              <span className="inline-flex items-center gap-[4px] px-[8px] py-[4px] bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-300 text-xs rounded-md">
                Priority: {priorityFilter}
                <button
                  onClick={() => setPriorityFilter('All')}
                  className="text-green-600 dark:text-green-400 hover:text-green-800 dark:hover:text-green-200"
                >
                  <i className="material-symbols-outlined text-[14px]">close</i>
                </button>
              </span>
            )}

            {searchQuery.trim() && (
              <span className="inline-flex items-center gap-[4px] px-[8px] py-[4px] bg-purple-100 dark:bg-purple-900/20 text-purple-800 dark:text-purple-300 text-xs rounded-md">
                Search: "{searchQuery.trim()}"
                <button
                  onClick={() => setSearchQuery('')}
                  className="text-purple-600 dark:text-purple-400 hover:text-purple-800 dark:hover:text-purple-200"
                >
                  <i className="material-symbols-outlined text-[14px]">close</i>
                </button>
              </span>
            )}

            <button
              onClick={() => {
                setStatusFilter('All');
                setPriorityFilter('All');
                setSearchQuery('');
              }}
              className="text-xs text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 underline"
            >
              Clear all
            </button>
          </div>
        )}
      </div>

      {/* Calendar Grid Layout */}
      <div className="lg:grid lg:grid-cols-3 gap-[25px]">
        {/* Main Calendar */}
        <div className="lg:col-span-2">
          <div className="trezo-card bg-white dark:bg-[#0c1427] mb-[25px] p-[20px] md:p-[25px] rounded-md">
            <div className="trezo-card-content relative">
              <div className="flex items-center justify-between mb-[20px]">
                <h2 className="text-[20px] font-semibold text-dark dark:text-title-dark">
                  Production Calendar
                </h2>
                <div className="flex items-center gap-[10px] text-xs">
                  <div className="flex items-center gap-[5px]">
                    <div className="w-[12px] h-[12px] bg-red-500 rounded"></div>
                    <span className="text-gray-600 dark:text-gray-400">Rush</span>
                  </div>
                  <div className="flex items-center gap-[5px]">
                    <div className="w-[12px] h-[12px] bg-purple-500 rounded"></div>
                    <span className="text-gray-600 dark:text-gray-400">Printing</span>
                  </div>
                  <div className="flex items-center gap-[5px]">
                    <div className="w-[12px] h-[12px] bg-yellow-500 rounded"></div>
                    <span className="text-gray-600 dark:text-gray-400">QC</span>
                  </div>
                  <div className="flex items-center gap-[5px]">
                    <div className="w-[12px] h-[12px] bg-green-500 rounded"></div>
                    <span className="text-gray-600 dark:text-gray-400">Packing</span>
                  </div>
                  <div className="flex items-center gap-[5px]">
                    <div className="w-[12px] h-[12px] bg-gray-500 rounded"></div>
                    <span className="text-gray-600 dark:text-gray-400">Blocked</span>
                  </div>
                </div>
              </div>
              <div id="fullCalendar">
                <FullCalendar
                  plugins={[dayGridPlugin, interactionPlugin]}
                  initialView="dayGridMonth"
                  events={calendarEvents}
                  eventClick={handleEventClick}
                  dateClick={handleDateClick}
                  headerToolbar={{
                    left: 'prev,next today',
                    center: 'title',
                    right: 'dayGridMonth'
                  }}
                  height="auto"
                  eventDisplay="block"
                  dayMaxEvents={3}
                  moreLinkClick="popover"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar - Quick Overview */}
        <div className="lg:col-span-1">
          {/* Due Today Jobs */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-[25px] mb-[25px]">
            <h2 className="text-[18px] font-semibold text-dark dark:text-title-dark mb-[15px] flex items-center">
              <i className="material-symbols-outlined text-[18px] mr-[8px] text-orange-600 dark:text-orange-400">today</i>
              Due Today ({dueToday.length})
            </h2>

            {dueToday.length > 0 ? (
              <div className="space-y-[12px]">
                {dueToday.slice(0, 3).map((job) => (
                  <div key={job.id} className="p-[12px] border border-orange-200 dark:border-orange-800 rounded-lg bg-orange-50 dark:bg-orange-900/10">
                    <div className="flex items-start justify-between mb-[6px]">
                      <div className="flex-1">
                        <h3 className="text-xs font-medium text-dark dark:text-title-dark mb-[4px]">
                          {job.product}
                        </h3>
                        <div className="flex items-center gap-[8px] text-xs text-gray-600 dark:text-gray-400">
                          <span>#{job.id}</span>
                          <span className={`px-1 py-0.5 rounded text-xs ${
                            job.priority === 'Rush' 
                              ? 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300'
                              : 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300'
                          }`}>
                            {job.priority}
                          </span>
                        </div>
                      </div>
                      <Link
                        to={`/maker/jobs/${job.id}`}
                        className="text-xs text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
                      >
                        View
                      </Link>
                    </div>
                  </div>
                ))}
                {dueToday.length > 3 && (
                  <div className="text-center pt-[8px]">
                    <Link
                      to="/maker/jobs"
                      className="text-xs text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
                    >
                      View all {dueToday.length} jobs →
                    </Link>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-[20px]">
                <i className="material-symbols-outlined text-[32px] text-gray-400 dark:text-gray-500 mb-[8px]">event_available</i>
                <p className="text-xs text-gray-500 dark:text-gray-400">No jobs due today</p>
              </div>
            )}
          </div>

          {/* Availability Card */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-[25px] mb-[25px]">
            <h2 className="text-[18px] font-semibold text-dark dark:text-title-dark mb-[15px] flex items-center">
              <i className="material-symbols-outlined text-[18px] mr-[8px] text-purple-600 dark:text-purple-400">schedule</i>
              Availability
            </h2>

            {/* Accept New Jobs Toggle */}
            <div className="flex items-center justify-between mb-[15px] p-[12px] border border-gray-200 dark:border-gray-700 rounded-lg">
              <div className="flex-1">
                <h3 className="text-sm font-medium text-dark dark:text-title-dark mb-[2px]">Accept New Jobs</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {acceptingNewJobs ? 'Currently accepting new job assignments' : 'Not accepting new jobs'}
                </p>
              </div>
              <button
                onClick={() => setAcceptingNewJobs(!acceptingNewJobs)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 ${
                  acceptingNewJobs 
                    ? 'bg-primary-600' 
                    : 'bg-gray-200 dark:bg-gray-700'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    acceptingNewJobs ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            {/* Add Blackout Date Button */}
            <button
              onClick={openBlackoutModal}
              className="w-full px-[12px] py-[10px] text-sm font-medium text-purple-600 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors dark:bg-purple-900/20 dark:text-purple-400 dark:hover:bg-purple-900/30 mb-[15px]"
            >
              <i className="material-symbols-outlined text-[16px] mr-[8px]">event_busy</i>
              Add Blackout Date
            </button>

            {/* Blackout Dates List */}
            {blackoutDates.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-dark dark:text-title-dark mb-[8px]">
                  Blackout Dates ({blackoutDates.length})
                </h4>
                <div className="space-y-[8px]">
                  {blackoutDates.slice(0, 3).map((blackout) => (
                    <div key={blackout.id} className="flex items-center justify-between p-[8px] bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800 rounded-lg">
                      <div className="flex-1">
                        <p className="text-xs font-medium text-dark dark:text-title-dark">
                          {new Date(blackout.startDate).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric'
                          })} - {new Date(blackout.endDate).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric'
                          })}
                        </p>
                        {blackout.reason && (
                          <p className="text-xs text-gray-600 dark:text-gray-400 truncate">
                            {blackout.reason}
                          </p>
                        )}
                      </div>
                      <button
                        onClick={() => handleRemoveBlackoutDate(blackout.id)}
                        className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 ml-[8px]"
                      >
                        <i className="material-symbols-outlined text-[14px]">close</i>
                      </button>
                    </div>
                  ))}
                  {blackoutDates.length > 3 && (
                    <div className="text-center pt-[8px]">
                      <button
                        onClick={openBlackoutModal}
                        className="text-xs text-purple-600 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300"
                      >
                        View all {blackoutDates.length} blackout dates →
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Quick Actions */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-[25px]">
            <h2 className="text-[18px] font-semibold text-dark dark:text-title-dark mb-[15px]">Quick Actions</h2>
            <div className="space-y-[8px]">
              <Link
                to="/maker/jobs"
                className="block w-full text-left px-[12px] py-[10px] text-sm font-medium text-primary-600 bg-primary-50 hover:bg-primary-100 rounded-lg transition-colors dark:bg-primary-900/20 dark:text-primary-400 dark:hover:bg-primary-900/30"
              >
                <i className="material-symbols-outlined text-[16px] mr-[8px]">list</i>
                View All Jobs
              </Link>
              <Link
                to="/maker/dashboard"
                className="block w-full text-left px-[12px] py-[10px] text-sm font-medium text-gray-700 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
              >
                <i className="material-symbols-outlined text-[16px] mr-[8px]">dashboard</i>
                Dashboard
              </Link>
            </div>

            {/* Blocked Jobs Alert */}
            {blocked.length > 0 && (
              <div className="mt-[15px] p-[12px] bg-yellow-50 dark:bg-yellow-900/10 rounded-lg border border-yellow-200 dark:border-yellow-800">
                <div className="flex items-center mb-[6px]">
                  <i className="material-symbols-outlined text-[14px] mr-[6px] text-yellow-600 dark:text-yellow-400">warning</i>
                  <span className="text-xs font-medium text-dark dark:text-title-dark">
                    {blocked.length} Blocked Job{blocked.length !== 1 ? 's' : ''}
                  </span>
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-400 mb-[6px]">
                  Require attention to resume production.
                </p>
                <Link
                  to="/maker/jobs"
                  className="text-xs text-yellow-600 hover:text-yellow-700 dark:text-yellow-400 dark:hover:text-yellow-300"
                >
                  Review blocked jobs →
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Day Details Panel/Modal */}
      {showDayDetails && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg w-full max-w-md mx-auto p-[25px]">
            <div className="flex items-center justify-between mb-[15px]">
              <h3 className="text-[18px] font-semibold text-dark dark:text-title-dark">
                Jobs on {formattedSelectedDate}
              </h3>
              <button
                onClick={closeDayDetails}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
              >
                <i className="material-symbols-outlined">close</i>
              </button>
            </div>

            {selectedDateJobs.length > 0 ? (
              <div className="space-y-[12px]">
                {selectedDateJobs.map((job) => (
                  <div key={job.id} className="p-[12px] border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-900/10">
                    <div className="flex items-start justify-between mb-[6px]">
                      <div className="flex-1">
                        <h4 className="text-sm font-medium text-dark dark:text-title-dark mb-[4px]">
                          {job.product}
                        </h4>
                        <div className="flex items-center gap-[8px] text-xs text-gray-600 dark:text-gray-400">
                          <span>#{job.id}</span>
                          <span className={`px-1 py-0.5 rounded text-xs ${
                            job.priority === 'Rush' 
                              ? 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300'
                              : 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300'
                          }`}>
                            {job.priority}
                          </span>
                        </div>
                      </div>
                      <Link
                        to={`/maker/jobs/${job.id}`}
                        className="text-xs text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
                      >
                        View
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-[20px]">
                <i className="material-symbols-outlined text-[32px] text-gray-400 dark:text-gray-500 mb-[8px]">event_busy</i>
                <p className="text-xs text-gray-500 dark:text-gray-400">No jobs found for this date</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Blackout Dates Modal */}
      {showBlackoutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg w-full max-w-md mx-auto p-[25px]">
            <div className="flex items-center justify-between mb-[15px]">
              <h3 className="text-[18px] font-semibold text-dark dark:text-title-dark">
                Blackout Dates
              </h3>
              <button
                onClick={closeBlackoutModal}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
              >
                <i className="material-symbols-outlined">close</i>
              </button>
            </div>

            <div className="space-y-[12px]">
              {/* Existing blackout dates */}
              {blackoutDates.length === 0 && (
                <div className="text-center py-[20px]">
                  <i className="material-symbols-outlined text-[32px] text-gray-400 dark:text-gray-500 mb-[8px]">block</i>
                  <p className="text-xs text-gray-500 dark:text-gray-400">No blackout dates set</p>
                </div>
              )}
              {blackoutDates.map(blackout => (
                <div key={blackout.id} className="p-[12px] border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-900/10">
                  <div className="flex items-center justify-between mb-[6px]">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-dark dark:text-title-dark">
                        {new Date(blackout.startDate).toLocaleDateString('en-US', {
                          weekday: 'short',
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })} - {new Date(blackout.endDate).toLocaleDateString('en-US', {
                          weekday: 'short',
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </p>
                      {blackout.reason && (
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {blackout.reason}
                        </p>
                      )}
                    </div>
                    <button
                      onClick={() => handleRemoveBlackoutDate(blackout.id)}
                      className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                    >
                      <i className="material-symbols-outlined text-[14px]">delete</i>
                    </button>
                  </div>
                </div>
              ))}

              {/* New blackout date form */}
              <div className="pt-[10px] mt-[10px] border-t border-gray-200 dark:border-gray-700">
                <h4 className="text-sm font-semibold text-dark dark:text-title-dark mb-[10px]">
                  Add New Blackout Date
                </h4>
                <div className="grid grid-cols-1 gap-[10px]">
                  <div>
                    <label className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-[4px]">
                      Start Date
                    </label>
                    <input
                      type="date"
                      value={blackoutForm.startDate}
                      onChange={(e) => setBlackoutForm({ ...blackoutForm, startDate: e.target.value })}
                      className="w-full px-[12px] py-[8px] text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-dark dark:text-title-dark focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-[4px]">
                      End Date
                    </label>
                    <input
                      type="date"
                      value={blackoutForm.endDate}
                      onChange={(e) => setBlackoutForm({ ...blackoutForm, endDate: e.target.value })}
                      className="w-full px-[12px] py-[8px] text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-dark dark:text-title-dark focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-[4px]">
                      Reason (optional)
                    </label>
                    <input
                      type="text"
                      placeholder="Reason for blackout"
                      value={blackoutForm.reason}
                      onChange={(e) => setBlackoutForm({ ...blackoutForm, reason: e.target.value })}
                      className="w-full px-[12px] py-[8px] text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-dark dark:text-title-dark placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>
                </div>
                <div className="mt-[10px]">
                  <button
                    onClick={handleBlackoutSubmit}
                    className="w-full px-[12px] py-[10px] text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-lg transition-colors"
                  >
                    <i className="material-symbols-outlined text-[16px] mr-[8px]">add</i>
                    Add Blackout Date
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default MakerCalendar;
