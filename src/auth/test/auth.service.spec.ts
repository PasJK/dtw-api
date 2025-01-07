import { Test, TestingModule } from "@nestjs/testing";
import { AuthService } from "../auth.service";
import { UserServiceV1 } from "@user/v1/user.service";
import { AuthHelper } from "../auth.helper";
import { LoginDto } from "../dto";
import { UserAgent } from "@utils/interface/userAgent.interface";
import { UserEntity } from "@user/entities/user.entity";

describe("AuthService", () => {
    let authService: AuthService;
    let userService: UserServiceV1;
    let authHelper: AuthHelper;

    const mockUserAgent: UserAgent = {
        device: "Chrome",
        name: "Chrome",
        type: "browser",
        brand: "Chrome",
        model: "Chrome",
    };

    const mockUser = {
        id: "123",
        username: "testuser",
    } as UserEntity;

    const mockAccessToken = {
        accessToken: "mock-token",
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                AuthService,
                {
                    provide: UserServiceV1,
                    useValue: {
                        findOneByUsername: jest.fn(),
                        signup: jest.fn(),
                    },
                },
                {
                    provide: AuthHelper,
                    useValue: {
                        generateAccessToken: jest.fn(),
                    },
                },
            ],
        }).compile();

        authService = module.get<AuthService>(AuthService);
        userService = module.get<UserServiceV1>(UserServiceV1);
        authHelper = module.get<AuthHelper>(AuthHelper);
    });

    describe("login", () => {
        const loginDto: LoginDto = {
            username: "testuser",
        };

        it("should return access token for existing user", async () => {
            jest.spyOn(userService, "findOneByUsername").mockResolvedValue(mockUser);
            jest.spyOn(authHelper, "generateAccessToken").mockResolvedValue(mockAccessToken.accessToken);

            const result = await authService.login(loginDto, mockUserAgent);

            expect(userService.findOneByUsername).toHaveBeenCalledWith(loginDto.username);
            expect(authHelper.generateAccessToken).toHaveBeenCalledWith(mockUser, mockUserAgent);
            expect(result).toEqual(mockAccessToken.accessToken);
        });

        it("should create new user and return access token for non-existing user", async () => {
            jest.spyOn(userService, "findOneByUsername").mockResolvedValue(null);
            jest.spyOn(userService, "signup").mockResolvedValue(mockUser);
            jest.spyOn(authHelper, "generateAccessToken").mockResolvedValue(mockAccessToken.accessToken);

            const result = await authService.login(loginDto, mockUserAgent);

            expect(userService.findOneByUsername).toHaveBeenCalledWith(loginDto.username);
            expect(userService.signup).toHaveBeenCalledWith(loginDto.username);
            expect(authHelper.generateAccessToken).toHaveBeenCalledWith(mockUser, mockUserAgent);
            expect(result).toEqual(mockAccessToken.accessToken);
        });
    });
});
