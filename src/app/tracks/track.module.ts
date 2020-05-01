import {ArtistModule} from '../artists/artist.module';

export class TrackModule {
  id: number;
  trackTitle: string;
  trackNumber: string;
  trackURL: any;
  trackImageURL: any;
  views: number;
  releaseDate: Date;
  time: string;
  price: any;
  rating: string;
  artist: ArtistModule;

  constructor() {

  }
}
