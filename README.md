# Svelte Kit Study Recording
## with Bizworks

## About
Learning SvelteKit by following [Coding Apple](https://www.youtube.com/@codingapple)'s tutorial series on YouTube, and expanding into full-stack practice with MariaDB, Prisma, and real project cloning.

---

### 📘 SvelteKit Basics (Coding Apple)
- [x] 2026.09.01 : Dynamic Routing, Nested Routing
- [x] 2026.09.03 : Nested Dynamic Routing, Catch All Route
- [x] 2026.09.04 : Optional Parameter Study

### MariaDB / RDBMS Fundamentals
> 정확한 날짜 기록이 없어 범위로 표기 (추정)
- [x] 2026.09.05 ~ 09.11 : Docker + MariaDB 환경 구축, DDL(CREATE/ALTER/DROP/TRUNCATE)
- [x] 2026.09.05 ~ 09.11 : DML(INSERT/SELECT/UPDATE/DELETE), 집계함수, GROUP BY/HAVING
- [x] 2026.09.05 ~ 09.11 : JOIN(INNER/LEFT/RIGHT), 서브쿼리, 상관 서브쿼리
- [x] 2026.09.05 ~ 09.11 : 정규화(1NF~3NF), 1:1 / 1:N / N:M 관계 설계, 복합 PK, 인덱스
- [x] 2026.09.05 ~ 09.11 : 트랜잭션(TCL), 권한 관리(DCL) 개념

### Blog Project (SvelteKit 5 + TS + Prisma)
- [x] 2026.09.12 : SvelteKit + Prisma 연동, CRUD(게시글/댓글/검색) 구현
- [x] 2026.09.14~15 (추정) : 회원가입/로그인 폼, bcrypt 해싱
- [x] 2026.09.15 : 세션 기반 인증(hooks.server.ts, 쿠키), 로그인 상태 전역 관리
- [x] 2026.09.15~16 : RBAC 권한 시스템(roles), 관리자 페이지, 마이페이지

### Worker Management App (SvelteKit 5 + TS + Prisma)
- [x] 2026.09.16 : 요구사항 분석 및 스키마 설계 (roles / groups / users / sessions / attendance)
- [x] 2026.09.16 : 순환 참조(FK) 처리, ON DELETE 정책 설계
- [ ] 로그인(아이디+전화번호 인증) 구현
- [ ] 역할별(관리자/팀장/유저) 페이지 분기
- [ ] 출퇴근 체크인/체크아웃 기능
- [ ] 급여 계산(시급 × 근무시간) 기능

---

## Projects
| 프로젝트 | 설명 | 폴더 |
|---|---|---|
| `blog-app` | SvelteKit 5 + Prisma + MariaDB 블로그, RBAC 권한 시스템 포함 | `/blog-app` |
| `workers` | 일용직 근태/급여 관리 앱 (진행 중) | `/workers` |

## Tech Stack
- SvelteKit 5, TypeScript
- Prisma ORM
- MariaDB (Docker)
