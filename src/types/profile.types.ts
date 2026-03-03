export enum ProfileTypes {
  Adult = 0,
  Kids = 1,
}

export interface Profile {
  id: string;
  userId: string;
  profileName: string;
  profilePhotoUrl: string;
  profileType: ProfileTypes;
  kidsProfile: boolean;
}
