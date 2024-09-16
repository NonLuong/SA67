package services

import (
    "errors"
    "time"

    jwt "github.com/dgrijalva/jwt-go"
)

// JwtWrapper wraps the signing key and the issuer
type JwtWrapper struct {
    SecretKey       string
    Issuer          string
    ExpirationHours int64
}

// JwtClaim adds email and role as claims to the token
type JwtClaim struct {
    Email string `json:"email"`
    Role  string `json:"role"` // เพิ่ม Role เข้าไปใน JWT Claim
    jwt.StandardClaims
}

// GenerateToken generates a jwt token
func (j *JwtWrapper) GenerateToken(email, role string) (signedToken string, err error) {
    claims := &JwtClaim{
        Email: email,
        Role:  role, // ตั้งค่า Role ของผู้ใช้
        StandardClaims: jwt.StandardClaims{
            ExpiresAt: time.Now().Local().Add(time.Hour * time.Duration(j.ExpirationHours)).Unix(),
            Issuer:    j.Issuer,
        },
    }

    token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)

    signedToken, err = token.SignedString([]byte(j.SecretKey))
    if err != nil {
        return "", err
    }

    return signedToken, nil
}

// ValidateToken validates the jwt token
func (j *JwtWrapper) ValidateToken(signedToken string) (claims *JwtClaim, err error) {
    token, err := jwt.ParseWithClaims(
        signedToken,
        &JwtClaim{},
        func(token *jwt.Token) (interface{}, error) {
            return []byte(j.SecretKey), nil
        },
    )

    if err != nil {
        return nil, err
    }

    claims, ok := token.Claims.(*JwtClaim)
    if !ok {
        return nil, errors.New("Couldn't parse claims")
    }

    if claims.ExpiresAt < time.Now().Local().Unix() {
        return nil, errors.New("JWT is expired")
    }

    return claims, nil
}
