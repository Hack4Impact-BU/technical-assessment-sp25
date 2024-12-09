// src/TestSupabase.tsx

import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface Project {
  id: number;
  name: string;
  created_at: string;
  // Add other fields as necessary
}

const TestSupabase: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await axios.get<{ data: Project[] }>(
          `${import.meta.env.VITE_API_BASE_URL}/test-supabase`
        );
        setProjects(response.data.data); // Assuming your API response has a 'data' field
        setLoading(false);
      } catch (err: any) {
        console.error('Error fetching data:', err);
        setError('Failed to fetch data.');
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <div>
      <h2>Projects from Supabase</h2>
      <ul>
        {projects.map((project) => (
          <li key={project.id}>
            {project.name} (Created at: {new Date(project.created_at).toLocaleString()})
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TestSupabase;