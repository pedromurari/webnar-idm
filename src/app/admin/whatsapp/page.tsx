'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Wifi, WifiOff, Plus, RefreshCw, QrCode, Loader2, Trash2 } from 'lucide-react'

interface Instance {
  id?: string
  instance_name: string
  status: 'connected' | 'disconnected' | 'connecting'
  phone_number?: string | null
  messages_sent_today?: number
}

export default function WhatsAppPage() {
  const [instances, setInstances] = useState<Instance[]>([])
  const [loading, setLoading] = useState(true)
  const [newName, setNewName] = useState('')
  const [newUrl, setNewUrl] = useState('')
  const [newKey, setNewKey] = useState('')
  const [creating, setCreating] = useState(false)
  const [qrCodes, setQrCodes] = useState<Record<string, string>>({})
  const [loadingQr, setLoadingQr] = useState<string | null>(null)

  async function loadInstances() {
    setLoading(true)
    const res = await fetch('/api/whatsapp/instances')
    const data = await res.json()
    setInstances(data.instances || [])
    setLoading(false)
  }

  async function createInstance() {
    if (!newName || !newUrl || !newKey) return
    setCreating(true)
    await fetch('/api/whatsapp/instances', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ instance_name: newName, evolution_url: newUrl, api_key: newKey }),
    })
    setNewName(''); setNewUrl(''); setNewKey('')
    setCreating(false)
    loadInstances()
  }

  async function loadQR(name: string) {
    setLoadingQr(name)
    const res = await fetch(`/api/whatsapp/instances/${name}/qrcode`)
    const data = await res.json()
    if (data.qr) setQrCodes(prev => ({ ...prev, [name]: data.qr }))
    setLoadingQr(null)
  }

  useEffect(() => { loadInstances() }, [])

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black">WhatsApp — Instâncias</h1>
          <p className="text-muted-foreground text-sm">Gerenciar instâncias Evolution API para envio de mensagens</p>
        </div>
        <Button variant="outline" size="sm" onClick={loadInstances}>
          <RefreshCw className="h-4 w-4 mr-2" /> Atualizar
        </Button>
      </div>

      {/* Instances list */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading ? (
          <div className="col-span-3 text-center py-12 text-muted-foreground"><Loader2 className="h-6 w-6 animate-spin mx-auto" /></div>
        ) : instances.length === 0 ? (
          <div className="col-span-3 text-center py-12 text-muted-foreground">Nenhuma instância configurada</div>
        ) : (
          instances.map(inst => (
            <Card key={inst.instance_name}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">{inst.instance_name}</CardTitle>
                  {inst.status === 'connected'
                    ? <span className="flex items-center gap-1 text-success text-xs"><Wifi className="h-3 w-3" /> Conectado</span>
                    : <span className="flex items-center gap-1 text-destructive text-xs"><WifiOff className="h-3 w-3" /> Desconectado</span>
                  }
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {inst.phone_number && <p className="text-sm text-muted-foreground">{inst.phone_number}</p>}
                <p className="text-xs text-muted-foreground">{inst.messages_sent_today || 0} msgs enviadas hoje</p>

                {inst.status !== 'connected' && (
                  <div>
                    <Button variant="outline" size="sm" className="w-full" onClick={() => loadQR(inst.instance_name)} disabled={loadingQr === inst.instance_name}>
                      {loadingQr === inst.instance_name ? <Loader2 className="h-3.5 w-3.5 animate-spin mr-2" /> : <QrCode className="h-3.5 w-3.5 mr-2" />}
                      Ver QR Code
                    </Button>
                    {qrCodes[inst.instance_name] && (
                      <div className="mt-3 p-2 bg-white rounded-lg">
                        <img src={qrCodes[inst.instance_name]} alt="QR Code" className="w-full max-w-[180px] mx-auto" />
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Add instance form */}
      <Card>
        <CardHeader><CardTitle className="text-sm flex items-center gap-2"><Plus className="h-4 w-4" />Adicionar Nova Instância</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <Label className="text-xs text-muted-foreground mb-1.5 block">Nome da instância</Label>
              <Input placeholder="ex: idm-principal" value={newName} onChange={e => setNewName(e.target.value)} className="h-9" />
            </div>
            <div>
              <Label className="text-xs text-muted-foreground mb-1.5 block">URL da Evolution API</Label>
              <Input placeholder="https://api.evolution.com" value={newUrl} onChange={e => setNewUrl(e.target.value)} className="h-9" />
            </div>
            <div>
              <Label className="text-xs text-muted-foreground mb-1.5 block">API Key</Label>
              <Input placeholder="sua-chave-aqui" value={newKey} onChange={e => setNewKey(e.target.value)} className="h-9" type="password" />
            </div>
          </div>
          <Button onClick={createInstance} disabled={creating || !newName || !newUrl || !newKey} className="bg-primary text-primary-foreground">
            {creating ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Plus className="h-4 w-4 mr-2" />}
            Criar Instância
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
