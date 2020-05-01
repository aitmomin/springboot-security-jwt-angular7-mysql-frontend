import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from 'rxjs';
import {PlayerService} from '../../service/player/player.service';

@Component({
  selector: 'app-track-control',
  templateUrl: './track-control.component.html',
  styleUrls: ['./track-control.component.scss']
})
export class TrackControlComponent implements OnInit, OnDestroy {

  isPlaying: boolean = false;
  playSub: Subscription;
  endedSub: Subscription;
  @Input()
  public track: any;

  constructor(private playerService: PlayerService) {
    this.playSub = playerService.playTrack$.subscribe(track => {
      this.isPlaying = false;
    });

    this.endedSub = playerService.trackEnded$.subscribe(() => {
      this.isPlaying = false;
    });
  }

  ngOnInit() {}

  ngOnDestroy() {
    this.playSub.unsubscribe();
    this.endedSub.unsubscribe();
  }

  playTrack() {
    this.playerService.playTrack(this.track.previewUrl);
    this.isPlaying = true;
  }

  pauseTrack() {
    this.playerService.pauseTrack();
    this.isPlaying = false;
  }

}
