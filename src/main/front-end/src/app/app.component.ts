import { Component } from '@angular/core';
import * as Stomp from 'stompjs';
import * as SockJS from 'sockjs-client';
import $ from 'jquery';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.css']
})
export class AppComponent {
	private serverUrl = 'http://localhost:8080/socket'
	private title = 'WebSockets chat';
	private stompClient;
	connected: boolean = false;
	private username: string ="avena";

	colors = [
		'#2196F3', '#32c787', '#00BCD4', '#ff5652',
		'#ffc107', '#ff85af', '#FF9800', '#39bbb0'
	];


	constructor() {
		//this.initializeWebSocketConnection();
		this.connect();
	}

	connect() {
		console.log(this.username);
		if (this.username) {
			var socket = new SockJS('/api/ws');
			this.stompClient = Stomp.over(socket);
			this.stompClient.connect({}, this.onConnected.bind(this), this.onError);
		}
	}

	initializeWebSocketConnection() {
		let ws = new SockJS(this.serverUrl);
		this.stompClient = Stomp.over(ws);
		let that = this;
		this.stompClient.connect({}, function(frame) {
			that.stompClient.subscribe('/topic/public', this.onMessageReceived);

		// Tell your username to the server
			that.stompClient.send("/app/chat.addUser",
				{},
				JSON.stringify({ sender: this.username, type: 'JOIN' })
			)
			that.stompClient.subscribe("/chat", (message) => {
				if (message.body) {
					$(".chat").append("<div class='message'>" + message.body + "</div>")
					console.log(message.body);
				}
			});
		});
	}

	onError(error) {
		console.log('Could not connect to WebSocket server. Please refresh this page to try again!');
	}


	onMessageReceived(payload) {
		var message = JSON.parse(payload.body);

		var messageElement = document.createElement('li');

		if (message.type === 'JOIN') {
			messageElement.classList.add('event-message');
			message.content = message.sender + ' joined!';
		} else if (message.type === 'LEAVE') {
			messageElement.classList.add('event-message');
			message.content = message.sender + ' left!';
		} else {
			messageElement.classList.add('chat-message');

			var avatarElement = document.createElement('i');
			var avatarText = document.createTextNode(message.sender[0]);
			avatarElement.appendChild(avatarText);
			avatarElement.style['background-color'] = this.getAvatarColor(message.sender);

			messageElement.appendChild(avatarElement);

			var usernameElement = document.createElement('span');
			var usernameText = document.createTextNode(message.sender);
			usernameElement.appendChild(usernameText);
			messageElement.appendChild(usernameElement);
		}

		var textElement = document.createElement('p');
		var messageText = document.createTextNode(message.content);
		textElement.appendChild(messageText);

		messageElement.appendChild(textElement);

		//messageArea.appendChild(messageElement);
		//messageArea.scrollTop = messageArea.scrollHeight;
	}

	getAvatarColor(messageSender) {
		var hash = 0;
		for (var i = 0; i < messageSender.length; i++) {
			hash = 31 * hash + messageSender.charCodeAt(i);
		}
		var index = Math.abs(hash % this.colors.length);
		return this.colors[index];
	}

	onConnected() {
		this.connected = true;
		
		// Subscribe to the Public Topic
		this.stompClient.subscribe('/topic/public', this.onMessageReceived);

		// Tell your username to the server
		this.stompClient.send("/app/chat.addUser",
			{},
			JSON.stringify({ sender: this.username, type: 'JOIN' })
		)

		//this.connectingElement.classList.add('hidden');
	}

	sendMessage(message) {
		this.stompClient.send("/app/send/message", {}, message);
		$('#input').val('');
	}

}