import React from 'react';
import { User } from '../../types';
import { UserTable } from '../../components/admin/UserTable';

interface AdminUsersPageProps {
  users: User[];
  onToggleStatus: (userId: string) => void;
  onDeleteUser?: (userId: string) => void;
}

export const AdminUsersPage: React.FC<AdminUsersPageProps> = ({
  users,
  onToggleStatus,
  onDeleteUser,
}) => {
  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div className="pb-3 border-b border-stone-200/80">
        <span className="text-[10px] font-bold uppercase tracking-widest text-stone-500 font-mono">
          MEMBERSHIP REGISTRY
        </span>
        <h1 className="font-serif-display text-2xl sm:text-3xl font-bold text-stone-900 mt-0.5">
          Patron & Scholar Registry
        </h1>
        <p className="text-xs sm:text-sm text-stone-600 mt-1">
          Oversee registered scholars, inspect reading privileges, and manage account statuses.
        </p>
      </div>

      <UserTable
        users={users}
        onToggleStatus={onToggleStatus}
        onDeleteUser={onDeleteUser}
      />
    </div>
  );
};
