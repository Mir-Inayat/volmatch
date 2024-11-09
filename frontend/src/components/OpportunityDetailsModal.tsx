import React from 'react';
import { Dialog } from '@headlessui/react';
import { X } from 'lucide-react';

interface OpportunityDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  opportunity: {
    id: number;
    title: string;
    date: string;
    volunteers_needed: number;
    volunteers_registered: number;
    description?: string;
    location?: string;
    requirements?: string;
  };
}

const OpportunityDetailsModal: React.FC<OpportunityDetailsModalProps> = ({
  isOpen,
  onClose,
  opportunity,
}) => {
  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="mx-auto max-w-2xl w-full bg-white dark:bg-gray-800 rounded-xl shadow-lg">
          <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700">
            <Dialog.Title className="text-xl font-semibold text-gray-900 dark:text-white">
              {opportunity.title}
            </Dialog.Title>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <div className="p-6 space-y-4">
            <div>
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Date</h3>
              <p className="mt-1 text-sm text-gray-900 dark:text-white">
                {new Date(opportunity.date).toLocaleDateString()}
              </p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Volunteers</h3>
              <p className="mt-1 text-sm text-gray-900 dark:text-white">
                {opportunity.volunteers_registered} / {opportunity.volunteers_needed} registered
              </p>
            </div>

            {opportunity.location && (
              <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Location</h3>
                <p className="mt-1 text-sm text-gray-900 dark:text-white">{opportunity.location}</p>
              </div>
            )}

            {opportunity.description && (
              <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Description</h3>
                <p className="mt-1 text-sm text-gray-900 dark:text-white">{opportunity.description}</p>
              </div>
            )}

            {opportunity.requirements && (
              <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Requirements</h3>
                <p className="mt-1 text-sm text-gray-900 dark:text-white">{opportunity.requirements}</p>
              </div>
            )}
          </div>

          <div className="flex justify-end gap-3 p-6 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 dark:text-gray-300 dark:bg-gray-700 dark:border-gray-600 dark:hover:bg-gray-600"
            >
              Close
            </button>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export default OpportunityDetailsModal; 