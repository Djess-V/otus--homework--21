export type IUserProfile = {
  userId: string;
  name: string;
};

abstract class UserProfileModel {
  abstract getUserProfile(userId: string): Promise<IUserProfile | null>;

  abstract createUserProfile(
    userId: string,
    name: string
  ): Promise<string | null>;
}

export default UserProfileModel;
