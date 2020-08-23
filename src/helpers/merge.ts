export {};

export interface searchType {
  song?: [String];
  artist?: [String];
  writer?: [String];
  album?: [String];
  year?: [Number];
}

const transformUser = async (user: any) => {
  return {
    ...user._doc,
    _id: user.id,
    password: "",
  };
};

const makeSearchQuery = (searchInput: any) => {
  let search = {} as searchType;
  if (searchInput) {
    if (searchInput.song) {
      search.song = searchInput.song;
    }
    if (searchInput.artist) {
      search.artist = searchInput.artist;
    }
    if (searchInput.writer) {
      search.writer = searchInput.writer;
    }
    if (searchInput.album) {
      search.album = searchInput.album;
    }
    if (searchInput.year) {
      search.year = searchInput.year;
    }
  }

  if (searchInput.writer) {
    return {
      ...search,
      writer: { $in: search.writer },
    };
  } else {
    return search;
  }
};

exports.transformUser = transformUser;
exports.makeSearchQuery = makeSearchQuery;
