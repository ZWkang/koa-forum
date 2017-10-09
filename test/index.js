
const collection = require('./collection.test.js');
const expect = require('expect')
// export const LOCAL_DOMAIN = 'localhost';
const superagent = require('supertest');
const app = require('../app.js');

function request() {
    return superagent(app.listen());
}

// function(request,superTest){
    describe('collection Test',function(){
        describe('Collection Add Article Test',function(){
            it('should be status 401 without user token ',function(done){
                request()
                .post('/collection/hahaha')
                .expect(401)
                .end(function(err,res){
                    if(err){
                        // console.log(err)
                        done(err);
                    }
                    done();
                })
            })
            it('if you have token but mongodb not have the article ',function(done){
                request()
                    .post('/collection/hahaha')
                    .set('authorization')
            })
        })

    })

// }

// collection(request,superagent)
