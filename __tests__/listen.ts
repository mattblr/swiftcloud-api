export {};
const app = require("../src/app");
const supertest = require("supertest");
const dbHandler = require("../jest/dbHandler");

const request = supertest(app);
const { setKeyHeader } = require("../jest/setAuthHeader");

describe("Listen data", () => {
  let token: String;
  beforeAll(async () => {
    token = await setKeyHeader();
  });

  afterAll(async () => await dbHandler.closeDatabase());

  it("returns listen data", async (done) => {
    request
      .post("/graphql")
      .send({
        query: `{
                getListens {
                  song
                  artist
                  writer
                  album
                  year
                  plays {
                    date
                    plays
                  }
                }
              }
              
              `,
      })
      .auth(token, { type: "bearer" })
      .set({
        Accept: "application/json",
      })
      .expect("Content-Type", /json/)
      .expect(200)
      .end((err: any, res: any) => {
        if (err) return done(err);
        expect(res.body).toBeInstanceOf(Object);
        expect(res.body.data.getListens.song).toBeDefined;
        expect(res.body.data.getListens.artist).toBeDefined;
        expect(res.body.data.getListens.writer).toBeDefined;
        expect(res.body.data.getListens.album).toBeDefined;
        expect(res.body.data.getListens.year).toBeDefined;
        expect(res.body.data.getListens.plays).toBeDefined;
        expect(res.body.data.getListens.length).toBe(10);
        done();
      });
  });

  it("returns pagnated listen data", async (done) => {
    request
      .post("/graphql")
      .send({
        query: `{
                getListens(pageSize:5, pageNumber:1) {
                  song
                  artist
                  writer
                  album
                  year
                  plays {
                    date
                    plays
                  }
                }
              }
              
              `,
      })
      .auth(token, { type: "bearer" })
      .set({
        Accept: "application/json",
      })
      .expect("Content-Type", /json/)
      .expect(200)
      .end((err: any, res: any) => {
        if (err) return done(err);
        expect(res.body).toBeInstanceOf(Object);
        expect(res.body.data.getListens.song).toBeDefined;
        expect(res.body.data.getListens.artist).toBeDefined;
        expect(res.body.data.getListens.writer).toBeDefined;
        expect(res.body.data.getListens.album).toBeDefined;
        expect(res.body.data.getListens.year).toBeDefined;
        expect(res.body.data.getListens.plays).toBeDefined;
        expect(res.body.data.getListens.length).toBe(5);
        done();
      });
  });
  it("returns most popular song all time", async (done) => {
    request
      .post("/graphql")
      .send({
        query: `{
                      mostPopularSong {
                        song
                        plays
                      }
                    }
                `,
      })
      .auth(token, { type: "bearer" })
      .set({
        Accept: "application/json",
      })
      .expect("Content-Type", /json/)
      .expect(200)
      .end((err: any, res: any) => {
        if (err) return done(err);
        expect(res.body).toBeInstanceOf(Object);
        expect(res.body.data.mostPopularSong.song).toBeDefined;
        expect(res.body.data.mostPopularSong.plays).toBeDefined;
        done();
      });
  });
  it("returns most popular song single month", async (done) => {
    request
      .post("/graphql")
      .send({
        query: `{
                      mostPopularSong(month:"june") {
                        song
                        plays
                      }
                    }
                `,
      })
      .auth(token, { type: "bearer" })
      .set({
        Accept: "application/json",
      })
      .expect("Content-Type", /json/)
      .expect(200)
      .end((err: any, res: any) => {
        if (err) return done(err);
        expect(res.body).toBeInstanceOf(Object);
        expect(res.body.data.mostPopularSong.song).toBeDefined;
        expect(res.body.data.mostPopularSong.plays).toBeDefined;
        done();
      });
  });

  it("returns least popular song all time", async (done) => {
    request
      .post("/graphql")
      .send({
        query: `{
                      leastPopularSong {
                        song
                        plays
                      }
                    }
                `,
      })
      .auth(token, { type: "bearer" })
      .set({
        Accept: "application/json",
      })
      .expect("Content-Type", /json/)
      .expect(200)
      .end((err: any, res: any) => {
        if (err) return done(err);
        expect(res.body).toBeInstanceOf(Object);
        expect(res.body.data.leastPopularSong.song).toBeDefined;
        expect(res.body.data.leastPopularSong.plays).toBeDefined;
        done();
      });
  });
  it("returns least popular song single month", async (done) => {
    request
      .post("/graphql")
      .send({
        query: `{
                      leastPopularSong(month:"june") {
                        song
                        plays
                      }
                    }
                `,
      })
      .auth(token, { type: "bearer" })
      .set({
        Accept: "application/json",
      })
      .expect("Content-Type", /json/)
      .expect(200)
      .end((err: any, res: any) => {
        if (err) return done(err);
        expect(res.body).toBeInstanceOf(Object);
        expect(res.body.data.leastPopularSong.song).toBeDefined;
        expect(res.body.data.leastPopularSong.plays).toBeDefined;
        done();
      });
  });

  it("returns hot and cold trends", async (done) => {
    request
      .post("/graphql")
      .send({
        query: `{
                      trendingHotCold {
                        hot {
                          song
                          trend
                        }
                        cold {
                          song
                          trend
                        }
                      }
                    }
                `,
      })
      .auth(token, { type: "bearer" })
      .set({
        Accept: "application/json",
      })
      .expect("Content-Type", /json/)
      .expect(200)
      .end((err: any, res: any) => {
        if (err) return done(err);
        expect(res.body).toBeInstanceOf(Object);
        expect(res.body.data.trendingHotCold.hot.song).toBeDefined;
        expect(res.body.data.trendingHotCold.hot.trend).toBeDefined;
        expect(res.body.data.trendingHotCold.cold.song).toBeDefined;
        expect(res.body.data.trendingHotCold.cold.trend).toBeDefined;
        done();
      });
  });
});
