import React, { useState } from 'react';
import { User } from '../../types';
import { Search, Shield, User as UserIcon, CheckCircle2, Ban, Eye, RotateCcw, Trash2 } from 'lucide-react';
import { Modal } from '../Modal';

interface UserTableProps {
  users: User[];
  onToggleStatus: (userId: string) => void;
  onDeleteUser?: (userId: string) => void;
}

export const UserTable: React.FC<UserTableProps> = ({ users, onToggleStatus, onDeleteUser }) => {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [roleFilter, setRoleFilter] = useState('all');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [deleteConfirmUser, setDeleteConfirmUser] = useState<User | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 8;

  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase());
    const matchesStatus =
      statusFilter === 'all' || u.status === statusFilter;
    const matchesRole =
      roleFilter === 'all' || u.role === roleFilter;
    return matchesSearch && matchesStatus && matchesRole;
  });

  const totalPages = Math.ceil(filteredUsers.length / pageSize) || 1;
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const paginatedUsers = filteredUsers.slice(
    (safeCurrentPage - 1) * pageSize,
    safeCurrentPage * pageSize
  );

  const resetFilters = () => {
    setSearch('');
    setStatusFilter('all');
    setRoleFilter('all');
    setCurrentPage(1);
  };

  const isFiltered = search !== '' || statusFilter !== 'all' || roleFilter !== 'all';

  return (
    <div className="space-y-4">
      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-stone-200/90 shadow-2xs">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3.5 top-2.5 w-4 h-4 text-stone-500 pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search patrons by name or email..."
            className="w-full pl-10 pr-3.5 py-2 text-xs bg-stone-50/70 border border-stone-200/90 rounded-xl placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-stone-900/10 focus:border-stone-900 font-medium text-stone-900 shadow-2xs transition-all"
          />
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="text-xs py-2 px-3 bg-stone-50 border border-stone-200/90 rounded-xl text-stone-700 font-semibold focus:outline-none focus:border-stone-900 shadow-2xs"
          >
            <option value="all">All Roles</option>
            <option value="admin">Administrators</option>
            <option value="user">Scholars / Readers</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-xs py-2 px-3 bg-stone-50 border border-stone-200/90 rounded-xl text-stone-700 font-semibold focus:outline-none focus:border-stone-900 shadow-2xs"
          >
            <option value="all">All Account Statuses</option>
            <option value="active">Active Only</option>
            <option value="inactive">Suspended Only</option>
          </select>

          {isFiltered && (
            <button
              onClick={resetFilters}
              className="py-2 px-2.5 text-xs text-stone-500 hover:text-stone-900 bg-stone-100 hover:bg-stone-200/70 rounded-xl transition-colors flex items-center gap-1 font-medium"
              title="Reset filters"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Reset</span>
            </button>
          )}
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white border border-stone-200/90 rounded-2xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-stone-50/90 border-b border-stone-200/80 text-[10px] font-bold uppercase tracking-widest text-stone-500 font-mono">
                <th className="py-3.5 px-5">Patron Scholar</th>
                <th className="py-3.5 px-4">Role & Access</th>
                <th className="py-3.5 px-4">Enrolled Date</th>
                <th className="py-3.5 px-4">Account Status</th>
                <th className="py-3.5 px-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 text-xs">
              {paginatedUsers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-14 text-center">
                    <div className="max-w-xs mx-auto space-y-2">
                      <UserIcon className="w-8 h-8 text-stone-300 mx-auto" />
                      <p className="text-stone-700 font-semibold">No patron accounts found</p>
                      <p className="text-[11px] text-stone-400">
                        Check your spelling or reset the status and role filters.
                      </p>
                      {isFiltered && (
                        <button
                          onClick={resetFilters}
                          className="mt-2 py-1.5 px-3 text-xs font-semibold text-stone-800 bg-stone-100 rounded-lg hover:bg-stone-200"
                        >
                          Clear Filters
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ) : (
                paginatedUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-amber-50/20 transition-colors">
                    {/* User info */}
                    <td className="py-3.5 px-5">
                      <div className="flex items-center gap-3.5">
                        <div className="w-8 h-8 rounded-full bg-stone-900 text-stone-100 flex items-center justify-center font-bold text-xs shadow-2xs font-serif-display">
                          {u.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-semibold text-stone-900 hover:text-amber-950">
                            {u.name}
                          </p>
                          <p className="text-[11px] text-stone-500 font-mono">
                            {u.email}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Role */}
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold font-mono tracking-wider uppercase ${
                          u.role === 'admin'
                            ? 'bg-amber-100 text-amber-900 border border-amber-200/90'
                            : 'bg-stone-100 text-stone-700 border border-stone-200'
                        }`}
                      >
                        {u.role === 'admin' && <Shield className="w-3 h-3 text-amber-700" />}
                        <span>{u.role === 'admin' ? 'Curator Admin' : 'Scholar'}</span>
                      </span>
                    </td>

                    {/* Member Since */}
                    <td className="py-3.5 px-4 text-stone-600 font-mono tabular-nums text-[11px]">
                      {new Date(u.createdAt).toLocaleDateString(undefined, {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </td>

                    {/* Status Toggle */}
                    <td className="py-3.5 px-4">
                      <button
                        onClick={() => onToggleStatus(u.id)}
                        disabled={u.role === 'admin'}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold transition-all ${
                          u.status === 'active'
                            ? 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200/80'
                            : 'bg-rose-50 text-rose-800 hover:bg-rose-100 border border-rose-200/80'
                        } ${u.role === 'admin' ? 'cursor-default opacity-85' : 'cursor-pointer hover:shadow-2xs'}`}
                        title={
                          u.role === 'admin'
                            ? 'Curator Admin accounts cannot be suspended'
                            : 'Click to toggle active/suspended status'
                        }
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            u.status === 'active' ? 'bg-emerald-500 pulse-available' : 'bg-rose-500'
                          }`}
                        />
                        <span className="capitalize">{u.status}</span>
                      </button>
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setSelectedUser(u)}
                          className="py-1.5 px-3 text-xs font-semibold text-stone-700 hover:text-stone-950 bg-stone-100 hover:bg-stone-200/80 rounded-xl inline-flex items-center gap-1.5 transition-colors"
                        >
                          <Eye className="w-3.5 h-3.5 text-stone-500" />
                          <span>Dossier</span>
                        </button>

                        {onDeleteUser && u.role !== 'admin' && (
                          <button
                            onClick={() => setDeleteConfirmUser(u)}
                            className="p-1.5 rounded-xl text-stone-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                            title={`Delete patron account for ${u.name}`}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="py-3.5 px-5 bg-stone-50/80 border-t border-stone-200/80 text-xs text-stone-600 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="font-mono text-[11px] text-stone-500">
            SHOWING <strong className="text-stone-900 font-semibold">{Math.min((safeCurrentPage - 1) * pageSize + 1, filteredUsers.length)}</strong> TO{' '}
            <strong className="text-stone-900 font-semibold">{Math.min(safeCurrentPage * pageSize, filteredUsers.length)}</strong> OF{' '}
            <strong className="text-stone-900 font-semibold">{filteredUsers.length}</strong> PATRONS
          </div>

          {totalPages > 1 && (
            <div className="flex items-center gap-1.5 font-mono">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={safeCurrentPage === 1}
                className="px-2.5 py-1 text-xs rounded-lg border border-stone-200 bg-white text-stone-700 hover:bg-stone-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                Previous
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
                <button
                  key={num}
                  onClick={() => setCurrentPage(num)}
                  className={`w-7 h-7 text-xs rounded-lg font-semibold transition-all ${
                    safeCurrentPage === num
                      ? 'bg-stone-900 text-white shadow-2xs'
                      : 'bg-white text-stone-700 border border-stone-200 hover:bg-stone-100'
                  }`}
                >
                  {num}
                </button>
              ))}

              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={safeCurrentPage === totalPages}
                className="px-2.5 py-1 text-xs rounded-lg border border-stone-200 bg-white text-stone-700 hover:bg-stone-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>

      {/* User Details Modal */}
      {selectedUser && (
        <Modal
          isOpen={Boolean(selectedUser)}
          onClose={() => setSelectedUser(null)}
          title="Patron Account Dossier"
          maxWidth="md"
        >
          <div className="space-y-5">
            <div className="flex items-center gap-4 p-4 bg-stone-50/80 rounded-2xl border border-stone-100">
              <div className="w-14 h-14 rounded-2xl bg-stone-900 text-white flex items-center justify-center font-bold text-xl shadow-xs font-serif-display">
                {selectedUser.name.charAt(0)}
              </div>
              <div>
                <h4 className="font-serif-display text-lg font-bold text-stone-900">
                  {selectedUser.name}
                </h4>
                <p className="text-xs text-stone-500 font-mono mt-0.5">{selectedUser.email}</p>
                <div className="flex items-center gap-2 mt-1.5">
                  <span className="text-[10px] uppercase font-bold tracking-wider font-mono text-stone-700 bg-stone-200 px-2 py-0.5 rounded">
                    {selectedUser.role}
                  </span>
                  <span
                    className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                      selectedUser.status === 'active'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-rose-100 text-rose-800'
                    }`}
                  >
                    {selectedUser.status}
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-2.5 text-xs p-1">
              <div className="flex justify-between py-1.5 border-b border-stone-100">
                <span className="font-mono text-stone-400 uppercase text-[10px]">PATRON ID</span>
                <span className="font-mono text-stone-800 font-semibold">{selectedUser.id}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-stone-100">
                <span className="font-mono text-stone-400 uppercase text-[10px]">ENROLLED DATE</span>
                <span className="text-stone-800 font-medium">
                  {new Date(selectedUser.createdAt).toLocaleString()}
                </span>
              </div>
              {selectedUser.favoriteGenre && (
                <div className="flex justify-between py-1.5 border-b border-stone-100">
                  <span className="font-mono text-stone-400 uppercase text-[10px]">RESEARCH FIELD</span>
                  <span className="text-stone-900 font-semibold">{selectedUser.favoriteGenre}</span>
                </div>
              )}
              {selectedUser.bio && (
                <div className="pt-2">
                  <span className="font-mono text-stone-400 uppercase text-[10px] block mb-1">
                    SCHOLARLY BIO
                  </span>
                  <p className="text-stone-700 p-3 bg-stone-50 rounded-xl border border-stone-100 italic leading-relaxed text-xs">
                    "{selectedUser.bio}"
                  </p>
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-stone-100 flex justify-between items-center">
              {selectedUser.role !== 'admin' && (
                <button
                  onClick={() => {
                    onToggleStatus(selectedUser.id);
                    setSelectedUser({
                      ...selectedUser,
                      status: selectedUser.status === 'active' ? 'inactive' : 'active',
                    });
                  }}
                  className={`py-2 px-3.5 text-xs font-semibold rounded-xl transition-colors flex items-center gap-1.5 ${
                    selectedUser.status === 'active'
                      ? 'bg-rose-50 text-rose-700 hover:bg-rose-100'
                      : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                  }`}
                >
                  {selectedUser.status === 'active' ? (
                    <>
                      <Ban className="w-3.5 h-3.5" />
                      <span>Suspend Patron Privileges</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Reactivate Patron Account</span>
                    </>
                  )}
                </button>
              )}

              <button
                onClick={() => setSelectedUser(null)}
                className="py-2 px-4 text-xs font-semibold text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-xl ml-auto"
              >
                Close Dossier
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Delete User Confirmation Modal */}
      {deleteConfirmUser && (
        <Modal
          isOpen={Boolean(deleteConfirmUser)}
          onClose={() => setDeleteConfirmUser(null)}
          title="Deaccession Patron Account"
          maxWidth="sm"
        >
          <div className="space-y-4">
            <p className="text-xs text-stone-600 leading-relaxed">
              Are you sure you want to permanently delete the patron account for{' '}
              <strong className="text-stone-900 font-semibold">{deleteConfirmUser.name}</strong> ({deleteConfirmUser.email})? This action will remove all saved personal shelf references and reading history.
            </p>

            <div className="p-3 bg-rose-50 rounded-xl border border-rose-200 text-rose-800 text-xs">
              <p className="font-semibold">Destructive Action</p>
              <p className="text-[11px] text-rose-700 mt-0.5">
                The account and all authenticated session access will be terminated.
              </p>
            </div>

            <div className="pt-3 border-t border-stone-100 flex items-center justify-end gap-2.5">
              <button
                onClick={() => setDeleteConfirmUser(null)}
                className="py-2 px-3.5 text-xs font-semibold text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (onDeleteUser) {
                    onDeleteUser(deleteConfirmUser.id);
                  }
                  if (selectedUser?.id === deleteConfirmUser.id) {
                    setSelectedUser(null);
                  }
                  setDeleteConfirmUser(null);
                }}
                className="py-2 px-4 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl transition-colors shadow-2xs"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
