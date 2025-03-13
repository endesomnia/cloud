'use client'

import { useRouter } from 'next/navigation'
import { Box, Button } from '@shared/ui'
import { Bucket, listBuckets } from '@src/shared/api'
import { routes } from '@src/shared/constant'
import { useEffect, useState } from 'react'
import { BucketDeleteButton } from '@src/features/bucket/delete'
import { BucketCreateButton, BucketCreateForm } from '@src/features/bucket/create'
import { formatDate } from '@src/shared/lib'

const Page = () => {
  const [buckets, setBuckets] = useState<Bucket[]>([])
  const [refetchIndex, setRefetchIndex] = useState(0)
  const router = useRouter()

  useEffect(() => {
    const fetchBuckets = async () => {
      const bucketsData = await listBuckets()
      if (Array.isArray(bucketsData)) {
        setBuckets(bucketsData)
      } else {
        console.error('Expected bucketsData to be an array, received:', bucketsData)
        setBuckets([])
      }
    }

    fetchBuckets()
  }, [refetchIndex])

  const redirectTo = (url: string) => {
    router.push(url)
  }

  return (
    <Box>
      <Box className="flex justify-between w-1/2">
        <h1 className="text-5xl justify-start m-5">Folders List</h1>
        <BucketCreateButton classes="text-2xl p-6 m-2 mb-0" />
        <BucketCreateForm setRefetch={setRefetchIndex}></BucketCreateForm>
      </Box>
      {buckets.length > 0 ? (
        <ul>
          {buckets.map((bucket) => (
            <li key={bucket.name} className="m-5 p-2 border border-gray-700 flex justify-between rounded-md">
              <Box>
                <Button
                  variant={'link'}
                  className="text-xl p-4 m-3 flex flex-col items-start"
                  onClick={() => redirectTo(`${routes.buckets}/${bucket.name}`)}
                >
                  <div>
                    <span className="text-gray-500">Name:</span>{' '}
                    <span className="text-gray-800 font-bold">{bucket.name}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Creation Date:</span>{' '}
                    <span className="text-gray-800 font-bold">{formatDate(bucket.creationDate)}</span>
                  </div>
                </Button>
              </Box>
              <Box className="flex items-center justify-center">
                <BucketDeleteButton bucketName={bucket.name} setRefetch={setRefetchIndex}></BucketDeleteButton>
              </Box>
            </li>
          ))}
        </ul>
      ) : (
        <Box className="flex justify-center items-center h-full">
          <span className="text-gray-800 font-bold text-7xl">Folders not found.</span>
        </Box>
      )}
    </Box>
  )
}

export default Page
