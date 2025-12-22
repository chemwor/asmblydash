import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getCaseById, updateStatus, getCaseMessages, addMessage, type MakerSupportCase, type ConversationMessage } from '../../features/makerSupport/mockMakerSupport';
import { getJobById } from '../../features/makerJobs/mockJobs';

interface Evidence {
  id: string;
  filename: string;
  uploadedBy: 'Maker' | 'Seller' | 'Support';
  uploadedAt: string;
  size: string;
  type: string;
}

const MakerSupportCaseDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [supportCase, setSupportCase] = useState<MakerSupportCase | null>(null);
  const [loading, setLoading] = useState(true);
  const [newMessage, setNewMessage] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [conversation, setConversation] = useState<ConversationMessage[]>([]);

  // Mock evidence data
  const [evidence] = useState<Evidence[]>([
    {
      id: '1',
      filename: 'failed_print_photos.jpg',
      uploadedBy: 'Maker',
      uploadedAt: '2024-12-20T15:30:00Z',
      size: '2.1 MB',
      type: 'image/jpeg'
    },
    {
      id: '2',
      filename: 'print_settings_report.pdf',
      uploadedBy: 'Maker',
      uploadedAt: '2024-12-20T16:00:00Z',
      size: '145 KB',
      type: 'application/pdf'
    },
    {
      id: '3',
      filename: 'customer_complaint.pdf',
      uploadedBy: 'Support',
      uploadedAt: '2024-12-20T14:00:00Z',
      size: '320 KB',
      type: 'application/pdf'
    }
  ]);

  useEffect(() => {
    if (id) {
      const caseData = getCaseById(id);
      setSupportCase(caseData);
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (id) {
      const messages = getCaseMessages(id);
      setConversation(messages);
    }
  }, [id]);

  const handleStatusUpdate = (newStatus: MakerSupportCase['status']) => {
    if (id && updateStatus(id, newStatus)) {
      setSupportCase(prev => prev ? { ...prev, status: newStatus } : null);
      setToastMessage(`Case status updated to ${newStatus}`);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    }
  };

  const handleAddUpdate = () => {
    if (newMessage.trim()) {
      addMessage(id, newMessage.trim());
      setConversation(prev => [
        ...prev,
        {
          id: (prev.length + 1).toString(),
          sender: 'Maker',
          message: newMessage.trim(),
          timestamp: new Date().toISOString()
        }
      ]);
      setToastMessage('Update added successfully');
      setShowToast(true);
      setNewMessage('');
      setTimeout(() => setShowToast(false), 3000);
    }
  };

  const getStatusSteps = (currentStatus: string) => {
    const allSteps = ['Open', 'In Review', 'Waiting on Maker', 'Resolved'];
    const statusMapping: { [key: string]: number } = {
      'Open': 0,
      'In Review': 1,
      'Waiting on Maker': 2,
      'Waiting on Seller': 2,
      'Resolved': 3,
      'Closed': 3
    };

    const currentStep = statusMapping[currentStatus] || 0;

    return allSteps.map((step, index) => ({
      name: step,
      completed: index < currentStep,
      current: index === currentStep,
      upcoming: index > currentStep
    }));
  };

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString();
  };

  const getSenderClass = (sender: string) => {
    switch (sender) {
      case 'Maker':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'Seller':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'Support':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const getFileIcon = (type: string) => {
    if (type.startsWith('image/')) return 'image';
    if (type === 'application/pdf') return 'picture_as_pdf';
    return 'description';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (!supportCase) {
    return (
      <div className="text-center py-12">
        <i className="material-symbols-outlined text-gray-400 text-6xl mb-4">error</i>
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Case not found</h3>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          The support case you're looking for doesn't exist or may have been removed.
        </p>
        <Link
          to="/maker/support"
          className="inline-flex items-center px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white font-medium text-sm rounded-lg transition-colors"
        >
          <i className="material-symbols-outlined text-sm mr-2">arrow_back</i>
          Back to Support Cases
        </Link>
      </div>
    );
  }

  const linkedJob = supportCase.linkedJobId ? getJobById(supportCase.linkedJobId) : null;
  const statusSteps = getStatusSteps(supportCase.status);

  return (
    <div className="relative">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-4">
          <Link
            to="/maker/support"
            className="inline-flex items-center text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors"
          >
            <i className="material-symbols-outlined text-lg mr-1">arrow_back</i>
            Back to Support Cases
          </Link>
        </div>

        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              {supportCase.caseId}
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              {supportCase.title}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => handleStatusUpdate('Resolved')}
              disabled={supportCase.status === 'Resolved' || supportCase.status === 'Closed'}
              className="inline-flex items-center px-4 py-2 bg-green-500 hover:bg-green-600 disabled:bg-gray-400 text-white font-medium text-sm rounded-lg transition-colors disabled:cursor-not-allowed"
            >
              <i className="material-symbols-outlined text-sm mr-2">check_circle</i>
              Mark Resolved
            </button>

            <button
              onClick={() => handleStatusUpdate('Open')}
              disabled={supportCase.status === 'Open'}
              className="inline-flex items-center px-4 py-2 bg-orange-500 hover:bg-orange-600 disabled:bg-gray-400 text-white font-medium text-sm rounded-lg transition-colors disabled:cursor-not-allowed"
            >
              <i className="material-symbols-outlined text-sm mr-2">refresh</i>
              Reopen Case
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Case Overview */}
          <div className="bg-white dark:bg-gray-dark rounded-lg border border-gray-200 dark:border-gray-600 p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Case Overview</h2>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Type</p>
                <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${supportCase.typeClass}`}>
                  {supportCase.type}
                </span>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Priority</p>
                <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${supportCase.priorityClass}`}>
                  {supportCase.priority}
                </span>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Status</p>
                <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${supportCase.statusClass}`}>
                  {supportCase.status}
                </span>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Assigned To</p>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {supportCase.assignedTo || 'Unassigned'}
                </p>
              </div>
            </div>

            {/* Linked Job */}
            {linkedJob && (
              <div className="border-t border-gray-200 dark:border-gray-600 pt-4 mb-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Linked Job</p>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {linkedJob.id} - {linkedJob.product}
                    </p>
                  </div>
                  <Link
                    to={`/maker/jobs/${linkedJob.id}`}
                    className="inline-flex items-center px-3 py-1 bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-200 font-medium text-sm rounded-lg hover:bg-primary-200 dark:hover:bg-primary-800 transition-colors"
                  >
                    <i className="material-symbols-outlined text-sm mr-1">open_in_new</i>
                    Open Job
                  </Link>
                </div>
              </div>
            )}

            {/* Dates */}
            <div className="border-t border-gray-200 dark:border-gray-600 pt-4 grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Created Date</p>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {new Date(supportCase.createdDate).toLocaleDateString()}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Last Updated</p>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {new Date(supportCase.updatedDate).toLocaleDateString()}
                </p>
              </div>
            </div>

            {/* Description */}
            <div className="border-t border-gray-200 dark:border-gray-600 pt-4 mt-4">
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Description</p>
              <p className="text-gray-900 dark:text-white">{supportCase.description}</p>
            </div>
          </div>

          {/* Timeline */}
          <div className="bg-white dark:bg-gray-dark rounded-lg border border-gray-200 dark:border-gray-600 p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Case Timeline</h2>

            <div className="relative">
              <div className="absolute left-4 top-4 bottom-4 w-0.5 bg-gray-200 dark:bg-gray-600"></div>

              {statusSteps.map((step) => (
                <div key={step.name} className="relative flex items-center mb-6 last:mb-0">
                  <div className={`relative z-10 flex items-center justify-center w-8 h-8 rounded-full border-2 ${
                    step.completed 
                      ? 'bg-green-500 border-green-500 text-white'
                      : step.current
                        ? 'bg-primary-500 border-primary-500 text-white'
                        : 'bg-white border-gray-300 text-gray-400 dark:bg-gray-700 dark:border-gray-500'
                  }`}>
                    {step.completed ? (
                      <i className="material-symbols-outlined text-sm">check</i>
                    ) : step.current ? (
                      <i className="material-symbols-outlined text-sm">radio_button_unchecked</i>
                    ) : (
                      <i className="material-symbols-outlined text-sm">radio_button_unchecked</i>
                    )}
                  </div>

                  <div className="ml-4">
                    <p className={`font-medium ${
                      step.completed || step.current 
                        ? 'text-gray-900 dark:text-white' 
                        : 'text-gray-500 dark:text-gray-400'
                    }`}>
                      {step.name}
                    </p>
                    {step.current && (
                      <p className="text-sm text-gray-500 dark:text-gray-400">Current status</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Conversation Thread */}
          <div className="bg-white dark:bg-gray-dark rounded-lg border border-gray-200 dark:border-gray-600 p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Conversation</h2>

            <div className="space-y-4 mb-6 max-h-96 overflow-y-auto">
              {conversation.map((message) => (
                <div key={message.id} className="border-l-4 border-gray-200 dark:border-gray-600 pl-4">
                  <div className="flex items-center gap-3 mb-2">
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getSenderClass(message.sender)}`}>
                      {message.sender}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {formatTimestamp(message.timestamp)}
                    </span>
                  </div>

                  <p className="text-gray-900 dark:text-white mb-2">{message.message}</p>

                  {message.attachments && message.attachments.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {message.attachments.map((attachment, idx) => (
                        <span key={idx} className="inline-flex items-center px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs rounded-md">
                          <i className="material-symbols-outlined text-xs mr-1">attachment</i>
                          {attachment}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Compose Box */}
            <div className="border-t border-gray-200 dark:border-gray-600 pt-4">
              <div className="space-y-3">
                <textarea
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Add an update to this case..."
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 resize-none"
                />

                <div className="flex items-center justify-between">
                  <button
                    type="button"
                    className="inline-flex items-center px-3 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                  >
                    <i className="material-symbols-outlined text-sm mr-1">attach_file</i>
                    Attach File
                  </button>

                  <button
                    onClick={handleAddUpdate}
                    disabled={!newMessage.trim()}
                    className="inline-flex items-center px-4 py-2 bg-primary-500 hover:bg-primary-600 disabled:bg-gray-400 text-white font-medium text-sm rounded-lg transition-colors disabled:cursor-not-allowed"
                  >
                    <i className="material-symbols-outlined text-sm mr-2">send</i>
                    Add Update
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Evidence */}
          <div className="bg-white dark:bg-gray-dark rounded-lg border border-gray-200 dark:border-gray-600 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Evidence</h2>
              <button
                type="button"
                className="inline-flex items-center px-3 py-2 text-sm bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-200 font-medium rounded-lg hover:bg-primary-200 dark:hover:bg-primary-800 transition-colors"
              >
                <i className="material-symbols-outlined text-sm mr-1">upload</i>
                Upload
              </button>
            </div>

            <div className="space-y-3">
              {evidence.map((file) => (
                <div key={file.id} className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="flex-shrink-0">
                    <i className={`material-symbols-outlined text-lg ${
                      file.type.startsWith('image/') 
                        ? 'text-green-500' 
                        : file.type === 'application/pdf' 
                          ? 'text-red-500' 
                          : 'text-gray-500'
                    }`}>
                      {getFileIcon(file.type)}
                    </i>
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                      {file.filename}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                      <span>{file.size}</span>
                      <span>•</span>
                      <span className={`px-1.5 py-0.5 rounded ${getSenderClass(file.uploadedBy)}`}>
                        {file.uploadedBy}
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    className="flex-shrink-0 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                  >
                    <i className="material-symbols-outlined text-sm">download</i>
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="bg-white dark:bg-gray-dark rounded-lg border border-gray-200 dark:border-gray-600 p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Actions</h2>

            <div className="space-y-3">
              <button
                onClick={() => handleStatusUpdate('In Review')}
                disabled={supportCase.status === 'In Review' || supportCase.status === 'Resolved' || supportCase.status === 'Closed'}
                className="w-full inline-flex items-center justify-center px-4 py-2 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white font-medium text-sm rounded-lg transition-colors disabled:cursor-not-allowed"
              >
                <i className="material-symbols-outlined text-sm mr-2">rate_review</i>
                Move to Review
              </button>

              <button
                onClick={() => handleStatusUpdate('Waiting on Seller')}
                disabled={supportCase.status === 'Waiting on Seller' || supportCase.status === 'Resolved' || supportCase.status === 'Closed'}
                className="w-full inline-flex items-center justify-center px-4 py-2 bg-orange-500 hover:bg-orange-600 disabled:bg-gray-400 text-white font-medium text-sm rounded-lg transition-colors disabled:cursor-not-allowed"
              >
                <i className="material-symbols-outlined text-sm mr-2">schedule</i>
                Wait for Seller
              </button>

              <button
                onClick={() => handleStatusUpdate('Closed')}
                disabled={supportCase.status === 'Closed'}
                className="w-full inline-flex items-center justify-center px-4 py-2 bg-gray-500 hover:bg-gray-600 disabled:bg-gray-400 text-white font-medium text-sm rounded-lg transition-colors disabled:cursor-not-allowed"
              >
                <i className="material-symbols-outlined text-sm mr-2">close</i>
                Close Case
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Toast Notification */}
      {showToast && (
        <div className="fixed top-4 right-4 z-50">
          <div className="bg-green-500 text-white px-6 py-4 rounded-lg shadow-lg flex items-center">
            <i className="material-symbols-outlined mr-2">check_circle</i>
            <span className="font-medium">{toastMessage}</span>
            <button
              onClick={() => setShowToast(false)}
              className="ml-4 text-green-200 hover:text-white"
            >
              <i className="material-symbols-outlined text-sm">close</i>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MakerSupportCaseDetail;
