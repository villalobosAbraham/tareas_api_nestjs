import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor(private readonly jwtService: JwtService) {} 

    async generateToken(userId: number) {
        let payload = { "id" : userId };
        return this.jwtService.sign(payload);
    }
    async validateToken(token: string) {
        try {
            let decoded = this.jwtService.verify(token);
            return decoded.id;
        } catch (error) {
            return null; 
        }
    }
    async decodeToken(token: string) {
        try {
            const decoded = this.jwtService.decode(token);
            return decoded;
        } catch (error) {
            return null; 
        }
    }
    async refreshToken(token: string) {
        try {
            const decoded = this.jwtService.verify(token, { ignoreExpiration: true });
            const newToken = this.jwtService.sign({ userId: decoded.userId });
            return newToken;
        } catch (error) {
            return null; 
        }
    }
}
