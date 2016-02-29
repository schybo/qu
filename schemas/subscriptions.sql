CREATE TABLE Subscriptions (
	Id serial primary key,
	ClassNumber int NOT NULL,
	ClassTitle varchar(255) NOT NULL,
	Email varchar(255) NOT NULL
);