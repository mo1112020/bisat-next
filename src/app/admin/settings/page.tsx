'use client';
import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { getSiteSettings, adminUpsertSiteSetting, SITE_SETTING_DEFAULTS } from '@/src/lib/db-browser';

// Group keys by their group label
const GROUPS = ['Home', 'Trust', 'Contact', 'Social', 'Footer'];

function getGroupKeys(group: string) {
  return Object.entries(SITE_SETTING_DEFAULTS)
    .filter(([, def]) => def.group === group)
    .map(([key]) => key);
}

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [localSettings, setLocalSettings] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState<string | null>(null);
  const [saved, setSaved] = useState<string | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    getSiteSettings().then(data => {
      setSettings(data);
      setLocalSettings(data);
    });
  }, []);

  const handleChange = (key: string, value: string) => {
    setLocalSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleSaveGroup = async (group: string) => {
    setSaving(group);
    setError('');
    const keys = getGroupKeys(group);
    const results = await Promise.all(
      keys.map(key => adminUpsertSiteSetting(key, localSettings[key] ?? ''))
    );
    const allOk = results.every(Boolean);
    setSaving(null);
    if (!allOk) {
      setError('Some settings failed to save. Check the console.');
      return;
    }
    setSettings(prev => {
      const next = { ...prev };
      keys.forEach(k => { next[k] = localSettings[k] ?? ''; });
      return next;
    });
    setSaved(group);
    setTimeout(() => setSaved(null), 2500);
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-1">Site Settings</h1>
        <p className="text-sm text-gray-400">Control text content displayed across the storefront.</p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 flex items-center justify-between">
          <p className="text-sm text-red-700">{error}</p>
          <button onClick={() => setError('')} className="text-red-400 hover:text-red-600"><X size={15} /></button>
        </div>
      )}

      {GROUPS.map(group => {
        const keys = getGroupKeys(group);
        const isDirty = keys.some(k => (localSettings[k] ?? '') !== (settings[k] ?? ''));

        return (
          <div key={group} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h2 className="font-bold text-gray-900">{group}</h2>
              <div className="flex items-center gap-3">
                {saved === group && (
                  <span className="text-xs font-semibold text-green-600">Saved!</span>
                )}
                <button
                  onClick={() => handleSaveGroup(group)}
                  disabled={saving === group || !isDirty}
                  className="bg-yellow-500 hover:bg-yellow-400 text-gray-950 font-bold px-4 py-2 rounded-xl text-xs transition-colors disabled:opacity-40"
                >
                  {saving === group ? 'Saving…' : 'Save All'}
                </button>
              </div>
            </div>

            <div className="p-6 space-y-5">
              {keys.map(key => {
                const def = SITE_SETTING_DEFAULTS[key];
                const currentVal = localSettings[key] ?? def.value;
                const isModified = currentVal !== def.value;

                return (
                  <div key={key}>
                    <div className="flex items-center gap-2 mb-1">
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider">
                        {def.label}
                      </label>
                      {isModified && (
                        <span className="text-[9px] uppercase tracking-wider font-bold text-yellow-600 bg-yellow-50 px-1.5 py-0.5 rounded">
                          Modified
                        </span>
                      )}
                    </div>

                    {def.type === 'textarea' ? (
                      <textarea
                        rows={3}
                        value={currentVal}
                        onChange={e => handleChange(key, e.target.value)}
                        className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-yellow-400 resize-none"
                      />
                    ) : (
                      <input
                        type={def.type === 'url' ? 'url' : 'text'}
                        value={currentVal}
                        onChange={e => handleChange(key, e.target.value)}
                        className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-yellow-400"
                      />
                    )}

                    {isModified && (
                      <p className="text-xs text-gray-400 mt-1">
                        Default: <span className="text-gray-500 italic">{def.value.length > 80 ? def.value.slice(0, 80) + '…' : def.value}</span>
                        <button
                          type="button"
                          onClick={() => handleChange(key, def.value)}
                          className="ml-2 text-yellow-600 hover:text-yellow-700 font-semibold underline underline-offset-2"
                        >
                          Reset
                        </button>
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
