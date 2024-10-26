import *as chai from 'chai'
import supertest from 'supertest'
import server from '../server.js'
import mongoose from 'mongoose'
import User from '../src/models/User.js'

const { expect, should } = chai
const request = supertest(server)
const db = process.env.URL

before(async function () {
    this.timeout(5000)
    await mongoose.connect(db)
    await User.deleteMany()
})

after(async function () {
    await User.deleteMany()
    await mongoose.disconnect()
})


describe('Auth Test Collection', function() {
    let refreshToken
    let accessToken

    it('should verify sign up request', async function() {
        const user = {
            'name': 'Test',
            'email': 'test@gmail.com',
            'password': '12345678'
        }

        const res = await request.post('/api/auth/signup')
        .send(user)

        expect(res.status).to.equal(200)
        expect(res.body).to.be.an('object')
    })

    it('should verify login request', async function() {
        const user = {
            'email': 'test@gmail.com',
            'password': '12345678'
        }

        const res = await request.post('/api/auth/login')
        .send(user)

        expect(res.status).to.equal(200)
        expect(res.body).to.be.an('object')

        refreshToken = res.headers['set-cookie'][0].split(';')[0].split('=')[1]
    })

    it('should verify get resfresh token request', async function() {
        const res = await request.post('/api/auth/refresh')
        .set('Cookie', `refreshToken=${refreshToken}`)

        expect(res.status).to.equal(200)
        expect(res.body).to.be.an('object')

        accessToken = res.body.accessToken
    })

    it('should verify tokens request', async function() {
        const res = await request.get(`/api/auth/verify`)
        .set('Authorization', `Bearer ${accessToken}`)

        expect(res.status).to.equal(200)
        expect(res.body).to.be.an('object')
    })

    it('should verify logout request', async function() {
        const res = await request.get(`/api/auth/verify`)
        .set('Authorization', `Bearer ${accessToken}`)

        expect(res.status).to.equal(200)
        expect(res.body.message).to.equal('Token is Verified')
    })
})
