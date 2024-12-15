import sqlite3

conn=sqlite3.connect('./instances/YWS2.db')
cursor=conn.cursor()

# cursor.execute(
#     '''
# CREATE TABLE IF NOT EXISTS students(
#     roll_no INTEGER PRIMARY KEY AUTOINCREMENT,
#     name TEXT,
#     class TEXT
# );
# '''
# )

# fname = "lorem ipsum"
# student_class = "10A"

# cursor.execute(
#     '''
#     INSERT INTO students (name, class) VALUES (?, ?)
#     ''',
#     (fname, student_class)
# )


cursor.execute("SELECT * FROM students")
row=cursor.fetchall()

for i in row:
    print(i)

conn.commit()
cursor.close()
conn.cursor()