const { diskinfo } = require('@dropb/diskinfo');
var mountutil = require('linux-mountutils');
module.exports = function (StorageSubsytem)
{
   var app = require('../../server/server');

   StorageSubsytem.getFileSystemsInfo = async function(mountPoint, ctx)
   {
       try
       {
           if(mountPoint)
           {
               const result = await diskinfo(mountPoint);
               return result;
           }
           else
           {
               const result = await diskinfo();
               return result;
           }
       }
       catch(exception)
       {
          console.error(exception);
          throw exception;
       }
   }

    StorageSubsytem.mount = function(device, mountPoint, options, ctx, cb)
    {
        try
        {
            mountutil.mount(device, mountPoint, options, function(result) {
                if(result.error)
                {
                    console.error(result.error);
                    cb(result.error);
                }
                else
                {
                    console.log(result);
                    cb(null,result);
                }
            });
        }
        catch(e)
        {
            cb(e);
        }
    }

    StorageSubsytem.umount = function(mountPoint, isDevice, options, ctx, cb)
    {
        try
        {
            mountutil.umount(mountPoint, isDevice, options, function(result) {
                if(result.error)
                {
                    console.error("Failed to unmount");
                    cb(result.error);
                }
                else
                {
                    console.log("Umount OK");
                    cb(null, result);
                }
            });
        }
        catch(e)
        {
            cb(e);
        }
    }

    StorageSubsytem.isMounted = function(mountPoint, isDevice, ctx, cb)
    {
        try
        {
            cb(null, mountutil.isMounted(mountPoint, isDevice));
        }
        catch(e)
        {
            cb(e);
        }
    }

    StorageSubsytem.ping = function(ctx, cb)
    {
        cb(null, 'pong');
    }

    StorageSubsytem.remoteMethod(
        'isMounted',
        {
            description: 'Check Mount',
            accepts: [
            { arg: "mountPoint", type: "string", required: true },
            { arg: "isDevice", type: "boolean", required: true },
            { arg: "ctx",  type: "object",  http: { source:'context' }}
            ],
            returns: {
                arg: 'result', type: 'object', root: true
            },
            http: {verb: 'get'}
        });
    

    StorageSubsytem.remoteMethod(
    'mount',
    {
        description: 'Mount File System',
        accepts: [
        { arg: "device", type: "string", required: true },
        { arg: "mountPoint", type: "string", required: true },
        { arg: "options", type: "object", required: true },
        { arg: "ctx",  type: "object",  http: { source:'context' }}
        ],
        returns: {
            arg: 'result', type: 'object', root: true
        },
        http: {verb: 'post'}
    });

    StorageSubsytem.remoteMethod(
    'umount',
    {
        description: 'Umount File System',
        accepts: [
        { arg: "mountPoint", type: "string", required: true },
        { arg: "isDevice", type: "boolean", required: true },
        { arg: "options", type: "object", required: true },
        { arg: "ctx",  type: "object",  http: { source:'context' }}
        ],
        returns: {
            arg: 'result', type: 'object', root: true
        },
        http: {verb: 'post'}
    });

    StorageSubsytem.remoteMethod(
    'ping',
    {
        description: 'Get File System(s) Info',
        accepts: [
        { arg: "ctx",  type: "object",  http: { source:'context' }}
        ],
        returns: {
            arg: 'result', type: 'string', root: true
        },
        http: {verb: 'get'}
    });

    StorageSubsytem.remoteMethod(
    'getFileSystemsInfo',
    {
        description: 'Get File System(s) Info',
        accepts: [
        { arg: "mountPoint",  type: "string",  required: false},
        { arg: "ctx",  type: "object",  http: { source:'context' }}
        ],
        returns: {
            arg: 'result', type: 'object', root: true
        },
        http: {verb: 'get'}
    });
}