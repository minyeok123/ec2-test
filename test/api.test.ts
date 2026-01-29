import request from "supertest";
import app from "../src/app";
import prisma from "../src/lib/prisma";

describe('api엔드포인트 테스트',  () => {
    beforeEach(async()=>{
      await prisma.task.deleteMany();
    })

    afterAll(async()=>{
       await prisma.$disconnect();
    })
    const agent = request.agent(app);
  
    describe('할일 목록 조회 API 테스트',()=>{
      test('할일 목록을 데이타가 없을 때 빈배열 반환',async()=>{
        const response = await request(app).get('/tasks');
        expect(response.status).toBe(200);
        expect(response.body).toEqual([]);
      })
      test('데이터가 있을 시 전부 반환',async ()=>{
       await prisma.task.create({data:{title:'할일1',description:'간식 먹기'}})
       await prisma.task.create({data:{title:'할일2',description:'간식 뱉기'}})
       const response = await agent.get('/tasks')
       expect(response.status).toBe(200);
       expect(response.body).toHaveLength(2);
      })
      test('count쿼리 값이 있을 시 값 만큼의 데이터 갯수만 반환',async()=>{
       await prisma.task.create({data:{title:'할일1',description:'간식 먹기'}})
       await prisma.task.create({data:{title:'할일2',description:'간식 뱉기'}})
       const response = await agent.get('/tasks').query({count:1})
       expect(response.status).toBe(200);
       expect(response.body).toHaveLength(1);
      })
      test('sort쿼리 값이 oldest일 시 오래된 순서로 반환',async()=>{
        await prisma.task.create({data:{title:'할일1',description:'간식 먹기'}})
        await prisma.task.create({data:{title:'할일2',description:'간식 뱉기'}})
        const response = await agent.get('/tasks').query({sort:'oldest'})
        expect(response.status).toBe(200);
      expect(response.body[0].title).toBe('할일1');
      expect(response.body[1].title).toBe('할일2');
      })

    
     
         
  })
    describe('할일 상세 조회 API 테스트', () => {
        beforeEach(async () => {
          await prisma.task.create({data:{id:'1',title:'할일1',description:'간식 먹기'}})
          await prisma.task.create({data:{title:'할일2',description:'간식 뱉기'}})
         })
        afterEach(async()=>{
            await prisma.task.deleteMany()
          })
        test('파라미터로 받은 ID와 일치하는 할 일 반환',async()=>{
         const taskId= 1
          const response = await agent.get(`/tasks/${taskId}`)
          expect(response.status).toBe(200)
          expect(response.body).toEqual({id:'1',title:'할일1',description:'간식 먹기',isComplete:false,createdAt:expect.any(String),updatedAt:expect.any(String)})
    
        })
        test('존재하지 않은 ID일때 404코드와 메시지 반환',async()=>{
          const taskId= 2
          const response = await agent.get(`/tasks/${taskId}`)
          expect(response.status).toBe(404)
          expect(response.body.message).toBe('해당 id를 찾을 수 없습니다.')
        })
       
       
        
       
    })
    describe('할일 생성 API 테스트',()=>{
          test('성공적으로 할 일 생성 요청 시 200코드와 생성한 할 일 반환',async()=>{
            const response = await agent.post('/tasks').send({title:'할일1',description:'간식 먹기'})
            expect(response.status).toBe(200)
            expect(response.body).toMatchObject({title:'할일1',description:'간식 먹기'})
          })
          test('최소한의 값으로 할 일 생성',async()=>{
            const response = await agent.post('/tasks').send({title:'최소값'})
            expect(response.status).toBe(200)
            expect(response.body.title).toEqual('최소값')
            expect(response.body.description).toBeNull()
            expect(response.body.description).toBeFalsy()
          })
        })

    describe('수정 api 엔드포인트 테스트',()=>{
          beforeEach(async()=>{
          await prisma.task.create({data:{id:'1',title:'할일1',description:'간식 먹기'}})
          await prisma.task.create({data:{id:'2',title:'할일2',description:'간식 뱉기'}})
          })
          afterEach(async()=>{
            await prisma.task.deleteMany()
          })
          test('성공적인 수정 요청 시 200코드와 수정한 할 일 반환',async()=>{
            const taskId = 1
            const response = await agent.patch(`/tasks/${taskId}`).send({title:'할일 수정',description:"할일 수정"})
            expect(response.status).toEqual(200)
            expect(response.body).toMatchObject({title:'할일 수정',description:"할일 수정"})            
        })
        test('성공적 부분요청 수정 요청 시 200코드와 할 일 반환',async ()=>{
          const taskId = 1
           const response = await agent.patch(`/tasks/${taskId}`).send({title:'부분 수정'})
           expect(response.status).toBe(200)
           expect(response.body).toMatchObject({title:'부분 수정',description:'간식 먹기'})
        })
        test('존재하지 않은 ID일때 404코드와 메시지 반환',async()=>{
           const taskId = 60
           const response = await agent.patch(`/tasks/${taskId}`).send({title:'부분 수정'})
           expect(response.status).toBe(404)
           expect(response.body.message).toBe('해당 id를 찾을 수 없습니다.')
        })
        })
    describe('삭제 요청 api 엔드포인트 테스트',()=>{
        beforeEach(async()=>{
          await prisma.task.create({data:{id:'1',title:'할일1',description:'간식 먹기'}})
          await prisma.task.create({data:{id:'2',title:'할일2',description:'간식 뱉기'}})
          })
          afterEach(async()=>{
            await prisma.task.deleteMany()
          })
        test('삭제 요청 성공 시 200코드 반환', async()=>{
          const taskId = 1
          const response = await agent.delete(`/tasks/${taskId}`)
          expect(response.status).toBe(200)
        })
        test('존재하지 않은 ID일때 404코드와 메시지 반환',async()=>{
          const taskId = 21
          const response = await agent.delete(`/tasks/${taskId}`)
          expect(response.status).toBe(404)
          expect(response.body.message).toBe('해당 id를 찾을 수 없습니다.')
        })
    })
  describe('로그인 테스트',()=>{
    test('이메일 또는 비밀번호 없이 요청이 왔을 때 400코드와 메시지 반환',async()=>{
      const response = await agent.post('/login').send({email:'test@example.com'})
      expect(response.status).toBe(400)
      expect(response.body.message).toBe('이메일과 비밀번호가 필요합니다.')
    })
    test('로그인 요청이 성공적으로 처리 되면 200코드와 토큰 , 성공 메세지 반환',async()=>{
      const response = await agent.post('/login').send({email:'test@example.com',password:"password"})
      expect(response.status).toBe(200)
      expect(response.body.message).toBe('로그인 성공')
      expect(JSON.stringify(response.header['set-cookie'])).toContain('token=simple-auth-token')})
    })
    test('일치하지 않은 이메일 또는 비밀번호로 로그인 요청이 오면 401코드와 메시지 반환',async()=>{
     const response = await agent.post('/login').send({email:'test@example.com',password:"passwasdord1"})
     expect(response.status).toBe(401)
      expect(response.body.message).toBe('이메일 또는 비밀번호가 일치하지 않습니다.')
    })
 
  describe('로그아웃 api 엔드포인트 테스트',()=>{
    test('로그아웃 요청이 성공하면 200 코드 반환 ',async()=>{
      const response = await agent.post('/logout')
      expect(response.status).toBe(200)
      expect(JSON.stringify(response.header['set-cookie'])).toContain('Expires=Thu, 01 Jan 1970 00:00:00 GMT')
    })
  })
  describe('로그인 상태에서 할 일 목록을 반환 api 엔드포인트 테스트',()=>{
        afterEach(async () => {
        await agent.post('/logout') 
    })
    test('로그인 상태에서 할 일 목록 반환 요청 성공시 200 코드와 할일 목록 반환',async()=>{
       await prisma.task.create({data:{id:'1',title:'할일1',description:'간식 먹기'}})
      await prisma.task.create({data:{id:'2',title:'할일2',description:'간식 뱉기'}})
      const loginResponse = await agent.post('/login').send({email:'test@example.com',password:"password"})
      expect(loginResponse.status).toBe(200)
      expect(JSON.stringify(loginResponse.header['set-cookie'])).toContain('token=simple-auth-token')
    const tasksResponse = await agent.get('/auth/tasks') 
    expect(tasksResponse.status).toBe(200)
    expect(tasksResponse.body.length).toBe(2)
    } )
    test('로그인x 할 일 목록 반환 요청 > 401코드와 메시지 반환',async()=>{
      const tasksResponse = await agent.get('/auth/tasks') 
      expect(tasksResponse.status).toBe(401)
      expect(tasksResponse.body.message).toBe('토큰이 없습니다.')
    })
     test('유효하지 않은 토큰, 할 일 목록 요청 시 401코드와 메시지 반환 ',async()=>{
      const tasksResponse = await agent.get('/auth/tasks').set('Cookie','token=invalid-token') 
      expect(tasksResponse.status).toBe(401)
      expect(tasksResponse.body.message).toBe('토큰이 유효하지 않습니다.')
    })
  })
    
})
