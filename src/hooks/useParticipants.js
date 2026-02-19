import { useState, useEffect } from 'react';
import { participantsService } from '../services/participantsService';

export const useParticipants = () => {
  const [participants, setParticipants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    participantsService.getAll()
      .then(setParticipants)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return { participants, loading, error };
};
