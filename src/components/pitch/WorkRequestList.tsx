'use client';

import { useState, useEffect } from 'react';
import { WorkRequestsService } from '@/services/workRequests.service';
import { useSupabaseAuth } from '@/context/SupabaseAuthContext';

interface WorkRequestListProps {
  projectId: string;
  isOwner?: boolean;
}

export default function WorkRequestList({
  projectId,
  isOwner = false,
}: WorkRequestListProps) {
  const { user } = useSupabaseAuth();
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');

  useEffect(() => {
    fetchRequests();
  }, [projectId, filter]);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const data = await WorkRequestsService.getWorkRequestsByProject(
        projectId,
        filter === 'all' ? undefined : filter
      );
      setRequests(data);
    } catch (error) {
      console.error('Error fetching work requests:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (requestId: string, newStatus: string) => {
    try {
      await WorkRequestsService.updateRequestStatus(requestId, newStatus);
      fetchRequests();
    } catch (error) {
      console.error('Error updating request status:', error);
      alert('Failed to update request status');
    }
  };

  const getRoleLabel = (roleType: string) => {
    return roleType
      .split('_')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'accepted':
        return 'bg-green-500/20 text-green-500';
      case 'declined':
        return 'bg-red-500/20 text-red-500';
      case 'withdrawn':
        return 'bg-gray-500/20 text-gray-500';
      default:
        return 'bg-blue-500/20 text-blue-500';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <p className="text-muted">Loading work requests...</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold">
          Work Requests ({requests.length})
        </h3>
        {isOwner && (
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-3 py-1 text-sm bg-surface border border-white/10 rounded-lg"
          >
            <option value="all">All</option>
            <option value="pending">Pending</option>
            <option value="accepted">Accepted</option>
            <option value="declined">Declined</option>
          </select>
        )}
      </div>

      {requests.length === 0 ? (
        <div className="glass-panel p-8 text-center">
          <p className="text-muted">No work requests yet</p>
        </div>
      ) : (
        <div className="space-y-4">
          {requests.map((request) => (
            <div
              key={request.id}
              className="glass-panel p-6 space-y-4 border-l-4"
              style={{
                borderLeftColor:
                  request.status === 'pending'
                    ? 'var(--primary)'
                    : 'transparent',
              }}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h4 className="font-bold">
                      {request.applicant?.display_name || 'Anonymous'}
                    </h4>
                    <span
                      className={`px-2 py-1 text-xs font-bold rounded-full ${getStatusColor(
                        request.status
                      )}`}
                    >
                      {request.status.charAt(0).toUpperCase() +
                        request.status.slice(1)}
                    </span>
                  </div>
                  <div className="text-sm text-muted mb-2">
                    <span className="font-semibold text-primary">
                      {getRoleLabel(request.role_type)}
                    </span>
                    {request.role_description && (
                      <span> - {request.role_description}</span>
                    )}
                  </div>
                  {request.experience_years && (
                    <p className="text-sm text-muted">
                      Experience: {request.experience_years} years
                    </p>
                  )}
                  {request.availability && (
                    <p className="text-sm text-muted">
                      Available:{' '}
                      {request.availability.replace('_', ' ').toLowerCase()}
                    </p>
                  )}
                </div>
                <span className="text-xs text-muted">
                  {new Date(request.created_at).toLocaleDateString()}
                </span>
              </div>

              <p className="text-sm">{request.message}</p>

              {request.portfolio_url && (
                <a
                  href={request.portfolio_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-primary hover:underline inline-block"
                >
                  View Portfolio →
                </a>
              )}

              {isOwner && request.status === 'pending' && (
                <div className="flex gap-3 pt-4 border-t border-white/10">
                  <button
                    onClick={() => handleStatusChange(request.id, 'accepted')}
                    className="btn btn-primary text-sm"
                  >
                    Accept
                  </button>
                  <button
                    onClick={() => handleStatusChange(request.id, 'declined')}
                    className="btn btn-outline text-sm"
                  >
                    Decline
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
