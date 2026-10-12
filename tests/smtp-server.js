import net from 'node:net';

// Solo escucha en loopback; captura mensajes ficticios sin entregarlos a Internet.
export async function smtpServer() {
  const messages=[];
  const sockets=new Set();
  const server=net.createServer(socket=> {
    sockets.add(socket);socket.on('close',()=>sockets.delete(socket));
    socket.setEncoding('utf8');socket.write('220 localhost test SMTP\r\n');
    let buffer='',reading=false,message='';
    socket.on('data',chunk=> {
      buffer+=chunk;let index;
      while((index=buffer.indexOf('\r\n'))>=0) {
        const line=buffer.slice(0,index);buffer=buffer.slice(index+2);
        if(reading) {
          if(line==='.') {reading=false;messages.push(message);socket.write('250 accepted\r\n');}
          else message+=line+'\r\n';
          continue;
        }
        if(/^EHLO|^HELO/.test(line))socket.write('250 localhost\r\n');
        else if(/^MAIL|^RCPT|^RSET/.test(line))socket.write('250 OK\r\n');
        else if(line==='DATA'){reading=true;message='';socket.write('354 send data\r\n');}
        else if(line==='QUIT')socket.end('221 bye\r\n');
        else socket.write('250 OK\r\n');
      }
    });
  });
  await new Promise((resolve,reject)=>{server.once('error',reject);server.listen(0,'127.0.0.1',resolve);});
  return {messages,port:server.address().port,async close(){for(const socket of sockets)socket.destroy();await new Promise(resolve=>server.close(resolve));}};
}
