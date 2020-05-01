import isAdmin from "./admin";
import { canUpdateOrDeleteAlbum, scopedAlbums } from "./album";
import { canDeleteArtist, canUpdateArtist } from "./artist";

export { isAdmin, canUpdateOrDeleteAlbum, scopedAlbums, canDeleteArtist, canUpdateArtist };
