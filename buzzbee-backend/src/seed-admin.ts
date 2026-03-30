import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './users/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const userRepo: Repository<User> = app.get(getRepositoryToken(User));

  const email = 'admin@gmail.com';
  const password = 'password';

  try {
    let user = await userRepo.findOne({ where: { email } });
    const hashedPassword = await bcrypt.hash(password, 10);
    
    if (!user) {
      console.log('Creating NEW admin user...');
      user = userRepo.create({
        fullName: 'Super Admin',
        email,
        password: hashedPassword,
        role: 'admin',
        termsAccepted: true
      });
    } else {
      console.log('Updating EXISTING user to admin with specified password...');
      user.role = 'admin';
      user.password = hashedPassword;
    }
    
    await userRepo.save(user);
    console.log('FORCE-SEED SUCCESS: admin@gmail.com / password');
  } catch (err) {
    console.error('ERROR:', err.message);
  }

  await app.close();
}
bootstrap();
