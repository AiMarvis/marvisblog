import React, { useState } from 'react';

interface AdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (password: string) => Promise<void>;
  error: string | null | undefined;
}

const AdminModal: React.FC<AdminModalProps> = ({ isOpen, onClose, onSubmit, error }) => {
  const [password, setPassword] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(password);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-space-dark/80 backdrop-blur-sm"
        onClick={onClose}
      ></div>

      {/* Modal */}
      <div className="relative bg-space-navy p-6 rounded-xl border border-space-light/10 w-full max-w-md">
        <h2 className="text-xl font-semibold text-space-light mb-4">
          관리자 인증
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-space-light/70 mb-1"
            >
              비밀번호
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 bg-space-dark/50 border border-space-light/10 rounded-lg text-space-light placeholder-space-light/30 focus:outline-none focus:border-space-glow/50"
              placeholder="관리자 비밀번호를 입력하세요"
              autoFocus
            />
            {error && (
              <p className="mt-2 text-sm text-red-400">{error}</p>
            )}
          </div>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-space-light/70 hover:text-space-light transition-colors"
            >
              취소
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium bg-space-glow/20 text-space-light border border-space-glow/30 rounded-lg hover:bg-space-glow/30 transition-colors"
            >
              확인
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminModal; 