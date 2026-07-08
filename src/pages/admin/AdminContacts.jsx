import { useState, useEffect } from 'react';
import FadeUp from '../../components/ui/FadeUp';
import { formatDate } from '../../utils/format';
import api from '../../utils/api';

export default function AdminContacts() {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/contact').then(({ data }) => setContacts(data)).finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-semibold text-text mb-8">Contact Submissions</h1>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-8 h-8 border-2 border-teal border-t-transparent rounded-full animate-spin" />
        </div>
      ) : contacts.length === 0 ? (
        <p className="text-gray-400 text-center py-20">No contact submissions yet.</p>
      ) : (
        <FadeUp>
          <div className="space-y-4">
            {contacts.map((contact) => (
              <div key={contact._id} className="bg-white rounded-2xl p-6 shadow-sm">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="font-medium text-text">{contact.name}</p>
                    <p className="text-sm text-gray-500">{contact.email} • {contact.phone}</p>
                  </div>
                  <span className="text-xs text-gray-400">{formatDate(contact.createdAt)}</span>
                </div>
                <p className="text-sm text-gray-600 leading-relaxed">{contact.message}</p>
              </div>
            ))}
          </div>
        </FadeUp>
      )}
    </div>
  );
}
