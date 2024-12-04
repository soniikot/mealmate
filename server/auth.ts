import { db } from "db";
import { users } from "@db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";

export async function registerUser(username: string, email: string, password: string) {
  const hashedPassword = await bcrypt.hash(password, 10);
  const [user] = await db.insert(users)
    .values({ username, email, password: hashedPassword })
    .returning();
  return user;
}

export async function validateUser(email: string, password: string) {
  const user = await db.query.users.findFirst({
    where: eq(users.email, email)
  });
  
  if (!user) return null;
  
  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) return null;
  
  return user;
}
