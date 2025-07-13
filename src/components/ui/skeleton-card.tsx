'use client'

import { Card, CardContent, CardHeader } from './card'
import { Skeleton } from './skeleton'

export function SkeletonCard() {
  return (
    <Card className="glass-card animate-pulse">
      <CardHeader className="pb-3">
        <div className="flex items-center space-x-3">
          <Skeleton className="h-12 w-12 rounded-full" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-5 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
        </div>
        <div className="flex flex-wrap gap-2">
          <Skeleton className="h-6 w-16 rounded-full" />
          <Skeleton className="h-6 w-20 rounded-full" />
          <Skeleton className="h-6 w-14 rounded-full" />
        </div>
        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center space-x-1">
            <Skeleton className="h-4 w-4" />
            <Skeleton className="h-4 w-8" />
          </div>
          <Skeleton className="h-10 w-20 rounded-md" />
        </div>
      </CardContent>
    </Card>
  )
}

export function SkeletonQuickAction() {
  return (
    <Card className="glass-card animate-pulse">
      <CardHeader>
        <div className="flex items-center space-x-3">
          <Skeleton className="h-12 w-12 rounded-xl" />
          <Skeleton className="h-6 w-32" />
        </div>
        <Skeleton className="h-4 w-full mt-2" />
        <Skeleton className="h-4 w-3/4" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-10 w-full rounded-md" />
      </CardContent>
    </Card>
  )
}

export function SkeletonDashboard() {
  return (
    <div className="space-y-8 pb-20 md:pb-8">
      {/* Welcome Section Skeleton */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center mb-6">
          <Skeleton className="w-20 h-20 rounded-full" />
        </div>
        <Skeleton className="h-12 w-96 mx-auto" />
        <div className="max-w-3xl mx-auto space-y-2">
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-6 w-4/5 mx-auto" />
        </div>
      </div>

      {/* Quick Actions Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
        {Array.from({ length: 5 }).map((_, index) => (
          <SkeletonQuickAction key={index} />
        ))}
      </div>

      {/* Features Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {Array.from({ length: 2 }).map((_, index) => (
          <Card key={index} className="glass-card animate-pulse">
            <CardHeader>
              <div className="flex items-center space-x-3">
                <Skeleton className="h-6 w-6" />
                <Skeleton className="h-6 w-48" />
              </div>
              <Skeleton className="h-4 w-full mt-2" />
            </CardHeader>
            <CardContent className="space-y-3">
              {Array.from({ length: 4 }).map((_, itemIndex) => (
                <div key={itemIndex} className="flex items-center space-x-3">
                  <Skeleton className="w-2 h-2 rounded-full" />
                  <Skeleton className="h-4 flex-1" />
                </div>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}