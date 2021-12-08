import { Component, Input, OnInit } from '@angular/core';
import { Member } from 'src/app/_models/member';
import { faUser, faHeart, faEnvelope } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-member-card',
  templateUrl: './member-card.component.html',
  styleUrls: ['./member-card.component.css']
})
export class MemberCardComponent implements OnInit {

  faUser = faUser;
  faEnvelope = faEnvelope;
  faHeart = faHeart;

  @Input() member: Member;
  constructor() { }

  ngOnInit(): void {
    
  }

}
