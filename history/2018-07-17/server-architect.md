S3에 이렇게 저장한다.

username-recent.json
username-cold-{{id1}}.json -
username-cold-{{id2}}.json - 이 친구들은 link list처럼 되어있음. 각 파일에 뒷녀석에 대한 정보가 적혀있음.
username-cold-{{id3}}.json -

각 Cold Data는 N개의 content를 가진다.
Recent Data는 최대 2N개의 content를 가진다.
Recent Data에 2N개의 content가 채워지는 순간!! 두개의 N개 파일로 쪼개버린다.
가장 최신의 content가 들어있는파일을 Recent Data로 계속 활용하고,
다른 파일을 Cold Data로서 저장한다.
ㅇㅋ? ㅇㅋ.