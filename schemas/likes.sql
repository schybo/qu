CREATE TABLE Likes (
	Id serial primary key,
	CatalogNumber varchar(50) NOT NULL,
	Subject varchar(50) NOT NULL,
	Likes int DEFAULT 0
);