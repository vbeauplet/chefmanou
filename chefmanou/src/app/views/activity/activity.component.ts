import { Component, OnInit } from '@angular/core';
import { ActivityService } from 'src/app/services/activity.service';
import { ProfileService } from 'src/app/services/profile.service';

@Component({
  selector: 'app-activity',
  host: { 'class' : 'page'},
  templateUrl: './activity.component.html',
  styleUrls: ['./activity.component.scss']
})
export class ActivityComponent implements OnInit {

  constructor(
      public profileService: ProfileService,
      public activityService: ActivityService
    ) { }

  ngOnInit(): void {
  }

}
