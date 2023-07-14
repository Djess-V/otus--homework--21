import { Database, ref, get, child, set } from "firebase/database";
import UserProfileModel, { IUserProfile } from "./UserProfileModel";

class FirebaseUserProfileModel extends UserProfileModel {
  private db;

  private parentCollectionName;

  private collectionName;

  constructor(
    db: Database,
    parentCollectionName: string,
    collectionName: string,
  ) {
    super();
    this.db = db;
    this.parentCollectionName = parentCollectionName;
    this.collectionName = collectionName;
  }

  async getUserProfile(userId: string): Promise<IUserProfile | null> {
    try {
      const dbRef = ref(this.db);
      const snapshot = await get(
        child(
          dbRef,
          `${this.parentCollectionName}${userId}${this.collectionName}`,
        ),
      );
      if (snapshot.exists()) {
        return snapshot.val();
      }

      throw new Error("User with this Id was not found!");
    } catch (e) {
      console.log((e as Error).message);
      return null;
    }
  }

  async createUserProfile(
    userId: string,
    name: string,
  ): Promise<string | null> {
    try {
      await set(
        ref(
          this.db,
          `${this.parentCollectionName}${userId}${this.collectionName}`,
        ),
        {
          userId,
          name,
        },
      );

      return userId;
    } catch (e) {
      return null;
    }
  }
}

export default FirebaseUserProfileModel;
