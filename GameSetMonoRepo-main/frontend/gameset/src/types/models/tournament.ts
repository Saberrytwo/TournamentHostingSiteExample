interface Tournament {
  tournamentID?: number;
  tournamentTitle: string;
  registrationStartDate: string;
  registrationEndDate: string;
  address1: string;
  address2?: string;
  city: string;
  state: string;
  zipcode: string;
  latitude?: number;
  longitude?: number;
  imageURL?: string;
  imageUrl?: string;
  startDate: string;
  tournamentStatusID: number;
  endDate: string;
  description: string;
  registrationFee?: number;
}

interface teamData {
  id: number;
  groupID: string;
  teamName: string;
  wins: number;
  losses: number;
  draws: number;
  pointsFor: number;
  pointsAgainst: number;
  pointDifference: number;
  averagePointDifference: number;
}

interface Registration {
  registrationID?: number;
  teamID: number;
  groupID?: string;
  TournamentDivisionID: number;
  Placement?: number;
  Seed?: number;
  CreatedAt?: Date;
  UpdatedAt?: Date;
  Notes?: string;
  team: Team;
  tournamentDivision: TournamentDivision;
  bracketSeed: number | null;
}

interface Group {
  groupID: string;
  groupName: string;
  order: number;
  groupDescription: string;
  tournamentDivisionID: number;
  tournamentDivision: TournamentDivision;
}

interface Team {
  teamID?: number;
  teamName: string;
  public: boolean;
  teamDescription: string;
  imageUrl?: string;
  users?: User[];
}

interface TournamentDivision {
  tournamentDivisionID: number;
  divisionID: number;
  TournamentID: number;

  division: Division;
  tournament: Tournament;
}

interface Division {
  divisionID: number;
  divisionName: string;
}

interface RegistrationBody {
  TeamID: number;
  TournamentID: number;
  DivisionID: number;
  // ... other properties if needed
}

interface User {
  userID: string;
  userName: string;
  imageURL: string | null;
  firstName: string | null;
  lastName: string | null;
  phoneNumber: string | null;
  email: string | null;
  birthdate: Date | null;
  zipcode: string | null;
  gender: string | null;
}

interface UserTeamStatus {
  team: Team;
  user: User;
  userID: string;
  teamID: number;
  userTeamStatusID: number;
  status: string;
}

interface TournamentBody {
  Tournament: Partial<Tournament>;
  DivisionIdList: number[];
  UserId: string;
}
interface UserTeamStatus {
  team: Team;
  user: User;
  userID: string;
  teamID: number;
  userTeamStatusID: number;
  status: string;
}

interface TournamentAdmin {
  tournamentAdminID?: number;
  tournamentID: number;
  userID: string;
  role: string;
  tournament?: Tournament;
  user?: User;
}
interface Match {
  matchID: number;
  registrationID1: number;
  registrationID2: number;
  score1: number | null;
  score2: number | null;
  roundNumber: number;
  registration1: Registration;
  registration2: Registration;
  matchNumber: number;
}

interface Group {
  groupID: string;
  groupName: string;
  order: number;
  tournamentDivisionID: number;
  tournamentDivision: TournamentDivision;
}

interface teamData {
  id: number;
  groupID: string;
  teamName: string;
  wins: number;
  losses: number;
  draws: number;
  pointsFor: number;
  pointsAgainst: number;
  pointDifference: number;
  averagePointDifference: number;
}

interface groupsTeamData {
  groupID: string;
  groupName: string;
  groupOrder: number;
  teams: teamData[];
}
