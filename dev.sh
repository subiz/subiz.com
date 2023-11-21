NAME=`basename "$PWD"`
NOW=`date +%s`
IMG=$(cat /dev/urandom | tr -dc '[:alpha:]' | fold -w ${1:-10} | head -n 1)

ssh-keygen -f ~/.ssh/id_rsa -y > ~/.ssh/id_rsa.pub
PUB=`cat ~/.ssh/id_rsa.pub`
MD5PUB=`echo -n $PUB | md5sum | cut -d ' ' -f 1`

echo -n $NOW | ssh-keygen -Y sign -n file -f ~/.ssh/id_rsa > "/tmp/$NAME.$IMG.sig"
SIGN=`cat "/tmp/$NAME.$IMG.sig" | od -v -A n -t x1 | sed 's/ *//g' | tr -d '\n'`

rsync -avzh * subiz.net:~/$NAME

wget -O env.remote "https://config.subiz.net/dev/$NAME?sign=$SIGN&timestamp=$NOW&md5key=$MD5PUB" || exit 0
rm "/tmp/$NAME.$IMG.sig"


ssh subiz.net <<EOF
  mkdir -p ~/$NAME
  cd ~/$NAME

  cat env.remote env.local > .env
  cat .env 
  docker build -t $NAME:$IMG .
  docker run -d $NAME:$IMG
EOF

rm env.remote
