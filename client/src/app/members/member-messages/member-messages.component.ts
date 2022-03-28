import { ChangeDetectionStrategy, Component, Input, OnInit, ViewChild } from '@angular/core';
import { Message } from 'src/app/_models/message';
import { MessageService } from 'src/app/_services/message.service';
import { faClock } from '@fortawesome/free-solid-svg-icons';
import { NgForm } from '@angular/forms';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-member-messages',
  templateUrl: './member-messages.component.html',
  styleUrls: ['./member-messages.component.css']
})
export class MemberMessagesComponent implements OnInit {

  faClock = faClock;
  @ViewChild('messageForm') messageForm: NgForm;
  @Input() messages: Message[];
  @Input() username: string;
  messageContent: string;
  loading: boolean = false;
  faSpinner = faSpinner;

  constructor(public messageService: MessageService) { }

  ngOnInit(): void {
  }

  sendMessage() {
    this.loading = true;
    this.messageService.sendMessage(this.username, this.messageContent).then(() => {
      this.messageForm.reset();
    }).finally(() => this.loading = false);
  }
 
}
