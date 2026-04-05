import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { User, RegistrationDraft } from '@/types/auth.types'
import { ProfilesService } from '@/features/profiles/services/profile-services'
import { CreateProfileRequest, Profile } from '@/features/profiles/types/profile.types'

const profilesService = new ProfilesService()

interface UserStorageState {
  user: User | null;
  completedStep: number;
  registrationDraft: Partial<RegistrationDraft>;
  profiles: CreateProfileRequest[];
  userId: string | null;
  token: string | null;
  setUser: (user: User) => void;
  clearUser: () => void;
  setCompletedStep: (step: number) => void;
  setRegistrationDraft: (data: Partial<RegistrationDraft>) => void;
  setProfiles: (profiles: CreateProfileRequest[]) => void;
  setUserId: (id: string) => void;
  setToken: (token: string) => void;
  resetRegistration: () => void;
  createProfile: (request: CreateProfileRequest) => Promise<Profile[]>;
  createProfiles: (requests: CreateProfileRequest[]) => Promise<Profile[]>;
}

export const createUserStorage = create<UserStorageState>()(
  persist(
    (set) => ({
      user: null,
      completedStep: 0,
      registrationDraft: {},
      profiles: [],
      userId: null,
      token: null,
      setUser: (user: User) => set({ user }),
      clearUser: () => set({ user: null }),
      setCompletedStep: (step: number) =>
        set((state) => ({ completedStep: Math.max(state.completedStep, step) })),
      setRegistrationDraft: (data: Partial<RegistrationDraft>) =>
        set((state) => ({ registrationDraft: { ...state.registrationDraft, ...data } })),
      setProfiles: (profiles: CreateProfileRequest[]) => set({ profiles }),
      setUserId: (id: string) => set({ userId: id }),
      setToken: (token: string) => set({ token }),
      resetRegistration: () => set({ completedStep: 0, user: null, registrationDraft: {}, profiles: [], userId: null, token: null }),
      createProfile: (request: CreateProfileRequest) => profilesService.createProfile(request),
      createProfiles: (requests: CreateProfileRequest[]) => profilesService.createProfiles(requests),
    }),
    {
      name: 'create-user-storage',
    }
  )
)