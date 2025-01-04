interface AutoCompleteSuggestion {
  item_id: string;
  main_text: string;
  secondary_text: string;
  other_info?: any;
}

interface TeamWithUsers {
  team: Team;
  users: User[];
  userTeamStatuses?: UserTeamStatus[];
}

interface TournamentsWithRegistrations {
  tournaments: Tournament[];
  registrationLists: { registrations: Registration[]; tournamentID: number }[];
}
