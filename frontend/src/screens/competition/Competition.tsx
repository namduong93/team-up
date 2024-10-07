import { FC, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { FlexBackground } from "../../components/general_utility/Background";

interface CompetitionDetails {
  participant: string;
  coach: string;
  siteCoordinator: string;
  admin: string;
}

interface Competition {
  id: string;
  name: string;
  location: string;
  date: string;
  details: CompetitionDetails;
}

// Mock data
const mockCompetitions: Competition[] = [
  {
    id: '1',
    name: 'ICPC',
    location: 'Kazakhstan',
    date: 'Sep 2024',
    details: {
      participant: 'Details for participants...',
      coach: 'Details for coaches...',
      siteCoordinator: 'Details for site coordinators...',
      admin: 'Details for admins...',
    },
  },
];

export const Competition: FC = () => {
  const { compId, role } = useParams<{ compId: string; role?: string }>(); // Get compID and role from URL
  const [competition, setCompetition] = useState<Competition | null>(null);

  // TODO: get comp information based on compID
  useEffect(() => {
    const fetchedCompetition = mockCompetitions.find(comp => comp.id === compId);
    if (fetchedCompetition) {
      setCompetition(fetchedCompetition);
    }
  }, [compId]);
  
  // if no comp found or waiting --> loading state
  if (!competition) return <div>Loading...</div>

  const roleLower = (role) ? role.toLowerCase().replace('-', '') : "no role"
  const roleDetails = competition.details[roleLower as keyof CompetitionDetails] || 'No details available for this role.';

  return (
    <FlexBackground>
      <div className="competition-details">
        <h1>{competition.name}</h1>
        <div>Location: {competition.location}</div>
        <div>Date: {competition.date}</div>
        <h2>Details for {role}</h2>
        <div>{roleDetails}</div>
      </div>
    </FlexBackground>
  )
}