// import { Test, TestingModule } from '@nestjs/testing';
// import { UsersController } from './users.controller';
// import { UsersService } from 'src/services/users/users.service';
// import { BadRequestException } from '@nestjs/common';

// describe('UsersController', () => {
//   let controller: UsersController;
//   let usersService: Partial<UsersService>;

//   beforeEach(async () => {
//     usersService = {
//       create: jest.fn(),
//       updateName: jest.fn(),
//       updateImage: jest.fn(),
//     };

//     const module: TestingModule = await Test.createTestingModule({
//       controllers: [UsersController],
//       providers: [
//         {
//           provide: UsersService,
//           useValue: usersService,
//         },
//       ],
//     }).compile();

//     controller = module.get<UsersController>(UsersController);
//   });

//   it('should create a user', async () => {
//     const dto = {
//       email: 'test@example.com',
//       password: 'secret',
//       name: 'example',
//       imageUrl: '',
//       moodEntries: [],
//     };
//     const result = await controller.register(dto);
//     expect(result).toEqual({ message: `user ${dto.email} created` });
//     expect(usersService.create).toHaveBeenCalledWith(dto);
//   });

//   it("should update user's name", async () => {
//     const dto = { id: '123ex', email: 'test@example.com', updatedName: 'John' };
//     const result = await controller.updateUserName(dto);
//     expect(result).toEqual({ message: `user's ${dto.email} name updated` });
//     expect(usersService.updateName).toHaveBeenCalledWith('123ex', 'John');
//   });

//   describe('uploadImage', () => {
//     const mockBody = { id: '123ex', email: 'test@example.com' };

//     it('should upload a valid image', async () => {
//       const mockFile = {
//         size: 1024 * 1024,
//         mimetype: 'image/png',
//       } as Express.Multer.File;

//       const result = await controller.uploadImage(mockFile, mockBody);
//       expect(result).toEqual({
//         message: `user's ${mockBody.email} image updated`,
//       });
//       expect(usersService.updateImage).toHaveBeenCalledWith(
//         mockBody.id,
//         mockFile,
//       );
//     });

//     it('should throw if file is missing', async () => {
//       await expect(
//         controller.uploadImage(
//           undefined as unknown as Express.Multer.File,
//           mockBody,
//         ),
//       ).rejects.toThrow(BadRequestException);
//     });

//     it('should throw if file is too large', async () => {
//       const mockFile = {
//         size: 6 * 1024 * 1024,
//         mimetype: 'image/png',
//       } as Express.Multer.File;

//       await expect(controller.uploadImage(mockFile, mockBody)).rejects.toThrow(
//         new BadRequestException('File size exceeds 5MB'),
//       );
//     });

//     it('should throw for invalid mime type', async () => {
//       const mockFile = {
//         size: 1024,
//         mimetype: 'application/pdf',
//       } as Express.Multer.File;

//       await expect(controller.uploadImage(mockFile, mockBody)).rejects.toThrow(
//         new BadRequestException(`Invalid file type: ${mockFile.mimetype}`),
//       );
//     });
//   });
// });
