export {};

const Listen = require("../../models/listen");

const { makeSearchQuery } = require("../../helpers/merge");

module.exports = {
  getListens: async (args: any, req: any) => {
    if (!req.keyAuth) {
      throw new Error("Not authorized!");
    }
    try {
      const sort =
        args.reverseSort === true
          ? "-" + (args.sortBy || "song")
          : args.sortBy || "song";

      const search = await makeSearchQuery(args.searchInput);

      const listenData =
        !args.pageSize && !args.pageNumber
          ? await Listen.find(search).sort(sort)
          : await Listen.find(search)
              .sort(sort)
              .skip((args.pageNumber - 1) * args.pageSize)
              .limit(args.pageSize);

      return listenData;
    } catch (err) {
      throw err;
    }
  },
  mostPopularSong: async (args: any, req: any) => {
    if (!req.keyAuth) {
      throw new Error("Not authorized!");
    }
    try {
      const search = makeSearchQuery(args.searchInput);

      const listenData = await Listen.find(search).select("-_id song plays");

      if (listenData.length > 0) {
        const totalListens = listenData.map((datum: any) => {
          return {
            song: datum.song,
            plays: datum.plays.reduce((a: any, b: any) => {
              return args.month
                ? b.date.toUpperCase() === args.month.toUpperCase()
                  ? a + b.plays
                  : a + 0
                : a + b.plays;
            }, 0),
          };
        });
        let mostPop: [any] = [{ song: "", plays: 0 }];
        mostPop.shift();
        totalListens.reduce((prev: any, current: any) => {
          return current.plays > prev.plays
            ? ((mostPop = [{ song: current.song, plays: current.plays }]),
              current)
            : current.plays === prev.plays
            ? (mostPop.push(current), current)
            : prev;
        });

        return mostPop;
      } else {
        return;
      }
    } catch (error) {
      throw error;
    }
  },

  leastPopularSong: async (args: any, req: any) => {
    if (!req.keyAuth) {
      throw new Error("Not authorized!");
    }
    try {
      const search = await makeSearchQuery(args.searchInput);
      const listenData = await Listen.find(search).select("-_id song plays");

      if (listenData.length > 0) {
        const totalListens = listenData.map((datum: any) => {
          return {
            song: datum.song,
            plays: datum.plays.reduce((a: any, b: any) => {
              return args.month
                ? b.date.toUpperCase() === args.month.toUpperCase()
                  ? a + b.plays
                  : a + 0
                : a + b.plays;
            }, 0),
          };
        });

        let leastPop: [any] = [{ song: "", plays: 0 }];
        leastPop.shift();
        totalListens
          .filter((a: any) => {
            return a.plays > 0 ? true : false;
          })
          .reduce((prev: any, current: any) => {
            return current.plays < prev.plays
              ? ((leastPop = [{ song: current.song, plays: current.plays }]),
                current)
              : current.plays === prev.plays
              ? (leastPop.push(current), current)
              : prev;
          });

        return leastPop;
      } else {
        return;
      }
    } catch (error) {
      throw error;
    }
  },
  trendingHotCold: async (args: any, req: any) => {
    if (!req.keyAuth) {
      throw new Error("Not authorized!");
    }
    try {
      const search = await makeSearchQuery(args.searchInput);
      const listenData = await Listen.find(search).select("-_id song plays");

      if (listenData.length > 0) {
        let totalListens = listenData.map((datum: any) => {
          return {
            song: datum.song,
            june: datum.plays[0].plays,
            july: datum.plays[1].plays,
            august: datum.plays[2].plays,
          };
        });

        const monthTotals = totalListens.reduce((a: any, b: any) => {
          return {
            june: a.june + b.june,
            july: a.july + b.july,
            august: a.august + b.august,
          };
        });

        totalListens = totalListens.map((monthValues: any) => {
          return {
            song: monthValues.song,
            trend:
              (monthValues.july / monthTotals.july -
                monthValues.june / monthTotals.june +
                (monthValues.august / monthTotals.august -
                  monthValues.july / monthTotals.july)) *
              100,
          };
        });

        const trendHot = totalListens.reduce((prev: any, current: any) => {
          return current.trend > prev.trend ? current : prev;
        });

        const trendCold = totalListens.reduce((prev: any, current: any) => {
          return current.trend < prev.trend ? current : prev;
        });

        const result = {
          hot: {
            song: trendHot.song,
            trend: trendHot.trend,
          },
          cold: {
            song: trendCold.song,
            trend: trendCold.trend,
          },
        };
        return result;
      } else {
        return;
      }
    } catch (error) {
      throw error;
    }
  },
};
