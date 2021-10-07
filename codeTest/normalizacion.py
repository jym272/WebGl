import numpy as np

u = np.arange(0,1,0.1)
v = np.arange(0,1,0.1)

radio = 5
def posicion(u, v):
    coord=[0,0,0]
    u = 2 * np.pi*u
    v = np.pi * v;
    coord[1] = radio * np.sin(u) * np.sin(v);
    coord[2] = radio * np.cos(u);
    coord[0] = radio * np.sin(u) * np.cos(v);
    return np.array(coord);
#coord[x,y,z]

def normalMediantePosicion(u,v, delta):
        p0 = posicion(u-delta,v-delta)
        p1 = posicion(u-delta,v)
        #delta_v = delta if (v>0) else -delta
        p2 = posicion(u,v-delta)
        a = p0 - p1
        b = p0 - p2
        if(u<=0.5 and u!=0): #corrige error en los signos para la esfera
            c=a
            a=b
            b=c
        cross = np.cross(a,b)
        #cross = [ a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0] ]
        return cross / np.linalg.norm(cross)


def normal(u, v):
        coord=[0,0,0]
        u = 2 * np.pi * u;
        v = np.pi * v;
        coord[0] = np.cos(v) * np.sin(u);
        coord[1] = np.sin(u) * np.sin(v);
        coord[2] = np.cos(u);
        return coord


u=0; v=0
posicion(u,v)
normal(u,v)

normalMediantePosicion(u,v, 0.01)
normalMediantePosicion(u,v, 0.000001)
