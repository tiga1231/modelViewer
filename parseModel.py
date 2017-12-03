prototxt = 'models/VGG_ILSVRC_16_layers_deploy.prototxt'

def log(s):
    if type(s) == dict:
        for k,v in s.items():
            print k+':',v
    elif type(s) == list:
        for l in s:
            print l
        print 
    else:
        print s


def add(buff, k, v):
    if type(v) == dict:
        buff[k] = v
        return
    
    if v[0].isdigit():
        if str(int(float(v))) == v:
            v = int(v)
        else:
            v = float(v)
    

    if k in buff:
        if type(buff[k]) == list:
            buff[k].append(v)
        else:
            buff[k] = [buff[k],v]
    else:
        buff[k] = v



res = {'layers':[]}
with open(prototxt) as f:
    buff = res
    for line in f:
        if line.startswith('layers {'):
            buff = {}
        elif line == '}\n':
            res['layers'].append(buff)
        elif line.find('}') > -1:
            add(prevBuff, key, buff)
            buff = prevBuff

        else:
            if line.find(':') > -1:
                k,v = line.split(':')
                k,v = k.strip(), v.strip()
                if v.startswith('"'):
                    v = v.replace('"','')
                add(buff, k, v)
            elif line.find('{') > -1:
                key = line.split('{')[0].strip()
                prevBuff = buff
                buff = {}
                
                


'''
log(res)
print

for l in res['layers']:
    log(l)
    print
'''
