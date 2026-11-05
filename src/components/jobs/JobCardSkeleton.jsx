import Skeleton from "../ui/Skeleton.jsx";

// Same shape as JobCard, so the layout doesn't jump when the jobs arrive.
function JobCardSkeleton() {
  return (
    <div className="job-card" aria-hidden="true">
      <div className="job-card-top">
        <Skeleton width="44px" height="44px" />
        <Skeleton width="96px" height="22px" />
      </div>

      <Skeleton width="85%" height="20px" />
      <Skeleton width="50%" />

      <div className="skeleton-lines">
        <Skeleton width="70%" height="14px" />
        <Skeleton width="45%" height="14px" />
        <Skeleton width="55%" height="14px" />
      </div>

      <div className="job-card-actions">
        <Skeleton height="36px" />
        <Skeleton height="36px" />
      </div>
    </div>
  );
}

export default JobCardSkeleton;
